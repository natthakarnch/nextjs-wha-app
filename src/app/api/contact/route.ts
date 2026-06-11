import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { contactSchema } from '@/lib/validations/contact'

export async function POST(req: Request) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY is not defined')
    }

    const resend = new Resend(resendApiKey)
    const body = await req.json()
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'ข้อมูลไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    const { name, email, message } = result.data

    await resend.emails.send({
      from: 'Contact Us <onboarding@resend.dev>',
      to: process.env.CONTACT_RECEIVER_EMAIL || 'admin@example.com',
      subject: `New Contact Message from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    })

    return NextResponse.json({ success: true, data: {} })
  } catch (error) {
    console.error('Contact Form Error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการส่งข้อความ' },
      { status: 500 }
    )
  }
}
