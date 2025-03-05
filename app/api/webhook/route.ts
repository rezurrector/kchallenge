import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const from = process.env.EMAIL_FROM!
const to = process.env.EMAIL_TO!

const PayloadSchema = z.object({
  event: z.string(),
  data: z.any(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const payload = PayloadSchema.parse(body)

    console.log("Webhook received:", payload)

    await resend.emails.send({
      from,
      to,
      subject: `Webhook: ${payload.event}`,
      text: JSON.stringify(payload, null, 2),
    })

    return NextResponse.json({ status: "success" })
  } catch (error: any) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
