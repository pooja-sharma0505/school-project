import { query } from "~/server/utils/db";
import { readBody } from "h3";
import { withErrorHandler, validateBody, badRequest } from "~/server/utils/api";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(
  withErrorHandler(async (event) => {
    requireAuth(event);

    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    const error = validateBody(body, [
      { field: "paid_amount", label: "Paid amount", required: true, type: "number", min: 0 },
      { field: "status", label: "Status", required: true, enum: ["unpaid", "partial", "paid", "overdue"] },
      { field: "paid_date", label: "Paid date", type: "date" },
      { field: "payment_method", label: "Payment method", enum: ["cash", "card", "bank_transfer", "check", "online"] },
    ]);

    if (error) badRequest(error);

    // Fetch the current fee record to validate against
    const [rows] = await query(
      "SELECT amount, paid_amount FROM fees WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      badRequest("Fee record not found.");
    }

    const fee = rows[0];
    const currentAmount = Number(fee.amount);
    const currentPaid = Number(fee.paid_amount);
    const newPaidAmount = Number(body.paid_amount);
    const totalPaid = currentPaid + newPaidAmount;

    // Validation: total paid amount must not exceed the fee amount
    if (totalPaid > currentAmount) {
      badRequest("Total paid amount cannot exceed the fee amount.");
    }

    // Validation: if status is 'paid', paid_date must be set
    if (body.status === "paid" && !body.paid_date) {
      badRequest("Paid date is required when status is 'paid'.");
    }

    // Validation: if status is 'unpaid' or 'overdue', paid_amount must be 0
    if ((body.status === "unpaid" || body.status === "overdue") && totalPaid > 0) {
      badRequest("Paid amount must be 0 when status is 'unpaid' or 'overdue'.");
    }

    // Validation: if totalPaid < amount, status must be 'partial'
    if (totalPaid < currentAmount && body.status !== "partial") {
      badRequest("Status must be 'partial' when total paid is less than the fee amount.");
    }

    // Validation: if totalPaid >= amount, status must be 'paid'
    if (totalPaid >= currentAmount && body.status !== "paid") {
      badRequest("Status must be 'paid' when total paid equals or exceeds the fee amount.");
    }

    const [result] = await query(
      `UPDATE fees
       SET paid_amount = ?,
           status = ?,
           paid_date = ?,
           payment_method = ?
       WHERE id = ?`,
      [
        totalPaid,
        body.status,
        body.paid_date || null,
        body.payment_method || null,
        id,
      ]
    );

    return {
      success: true,
      message: "Payment recorded successfully",
      affectedRows: result.affectedRows,
    };
  })
);
