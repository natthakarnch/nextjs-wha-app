"use client"

import { useState, useTransition } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { 
  Field, 
  FieldError, 
  FieldLabel 
} from '@/components/ui/field'
import { contactSchema, type ContactFormValues } from '@/lib/validations/contact'

export function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  async function onSubmit(values: ContactFormValues) {
    startTransition(async () => {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Something went wrong')
        }

        toast.success('ส่งข้อความสำเร็จ')
        setIsSuccess(true)
        form.reset()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการส่งข้อความ')
      }
    })
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-8">
        <CheckCircle className="w-12 h-12 text-green-500" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">ส่งข้อความสำเร็จ!</h3>
          <p className="text-muted-foreground">เราจะติดต่อกลับหาคุณโดยเร็วที่สุด</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsSuccess(false)}
        >
          ส่งข้อความอีกครั้ง
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="contact-name">ชื่อ</FieldLabel>
            <Input 
              {...field} 
              id="contact-name" 
              placeholder="กรอกชื่อของคุณ" 
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="contact-email">Email</FieldLabel>
            <Input 
              {...field} 
              id="contact-email" 
              type="email" 
              placeholder="example@email.com" 
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
      <Controller
        name="message"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="contact-message">ข้อความ</FieldLabel>
            <Textarea 
              {...field} 
              id="contact-message" 
              placeholder="พิมพ์ข้อความที่ต้องการ..." 
              className="resize-none" 
              rows={5} 
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isPending}
      >
        {isPending ? 'กำลังส่ง...' : 'ส่งข้อความ'}
      </Button>
    </form>
  )
}
