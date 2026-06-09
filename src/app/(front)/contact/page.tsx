import { Mail, Phone, Clock } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { ContactForm } from './contact-form'

export default async function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">ติดต่อเรา</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            หากคุณมีคำถามหรือต้องการข้อมูลเพิ่มเติม สามารถติดต่อเราได้ผ่านช่องทางด้านล่างนี้ ทีมงานของเราพร้อมให้บริการคุณ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-8 md:gap-12">
          <div className="flex flex-col gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">อีเมล</p>
                  <p className="text-sm text-muted-foreground">contact@wha-group.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">เบอร์โทรศัพท์</p>
                  <p className="text-sm text-muted-foreground">02-xxx-xxxx</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">เวลาทำการ</p>
                  <p className="text-sm text-muted-foreground">จันทร์ - ศุกร์: 08:30 - 17:30 น.</p>
                </div>
              </div>
            </div>
            <Separator />
            <p className="text-sm text-muted-foreground">
              เรามุ่งมั่นที่จะตอบกลับทุกข้อความอย่างรวดเร็วและครบถ้วนที่สุด 
              โปรดระบุรายละเอียดความต้องการของคุณในแบบฟอร์มเพื่อให้เราประสานงานได้อย่างถูกต้อง
            </p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
