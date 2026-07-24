import getPool from "~/server/utils/db";
import { readBody } from "h3";
import { withErrorHandler, validateBody, badRequest, requireAuth } from "~/server/utils/api";

export default defineEventHandler(
  withErrorHandler(async (event) => {
    requireAuth(event);

    const body = await readBody(event);

    const error = validateBody(body, [
      { field: "student_id", label: "Student", required: true, type: "number", min: 1 },
      { field: "title", label: "Fee title", required: true, type: "string", max: 100 },
      { field: "amount", label: "Amount", required: true, type: "number", min: 0 },
      { field: "paid_amount", label: "Paid amount", type: "number", min: 0 },
      { field: "due_date", label: "Due date", type: "date" },
      { field: "paid_date", label: "Paid date", type: "date" },
      { field: "payment_method", label: "Payment method", enum: ["cash", "card", "bank_transfer", "check", "online"] },
      { field: "note", label: "Note", type: "string", max: 500 },
      { field: "status", label: "Status", enum: ["unpaid", "partial", "paid", "overdue"] },
    ]);

    if (error) badRequest(error);

    const amount = Number(body.amount);
    const paidAmount = Number(body.paid_amount) || 0;

    // Validation: paid_amount must not exceed amount
    if (paidAmount > amount) {
      badRequest("Paid amount cannot exceed the total amount.");
    }

    // Validation: if paid_amount > 0, status must be 'partial' or 'paid'
    if (paidAmount > 0 && paidAmount < amount && body.status && body.status !== "partial") {
      badRequest("Status must be 'partial' when paid amount is less than total amount.");
    }

    // Validation: if paid_amount >= amount, status must be 'paid'
    if (paidAmount >= amount && paidAmount > 0 && body.status && body.status !== "paid") {
      badRequest("Status must be 'paid' when paid amount equals or exceeds total amount.");
    }

    // Validation: if status is 'paid', paid_date must be set
    if (body.status === "paid" && !body.paid_date) {
      badRequest("Paid date is required when status is 'paid'.");
    }

    // Validation: if status is 'unpaid' or 'overdue', paid_amount must be 0
    if ((body.status === "unpaid" || body.status === "overdue") && paidAmount > 0) {
      badRequest("Paid amount must be 0 when status is 'unpaid' or 'overdue'.");
    }

    const pool = getPool();

    const [result] = await pool.query(
      `INSERT INTO fees (
        student_id,
        title,
        amount,
        paid_amount,
        due_date,
        paid_date,
        payment_method,
        note,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.student_id,
        body.title,
        amount,
        paidAmount,
        body.due_date || null,
        body.paid_date || null,
        body.payment_method || null,
        body.note || null,
        body.status || "unpaid",
      ]
    );

    return {
      success: true,
      message: "Fee added successfully",
      id: result.insertId,
    };
  })
);
