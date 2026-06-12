import React, { useRef, useState } from 'react';
import { useLanguage } from '../App';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

const Contact = () => {
  const { t, lang } = useLanguage();
  const form = useRef();
  const [isSending, setIsSending] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    // Mobile Validation (Indian Number Format)
    const mobileValue = form.current.user_mobile.value;
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobileValue)) {
      toast.error(lang === 'en' ? "Please enter a valid 10-digit Indian mobile number." : "कृपया एक मान्य 10-अंकीय भारतीय मोबाइल नंबर दर्ज करें।");
      return;
    }

    setIsSending(true);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (serviceId === 'your_service_id' || !serviceId) {
      toast.error(lang === 'en' ? "Please configure EmailJS in .env" : "कृपया .env फ़ाइल में EmailJS कॉन्फ़िगर करें");
      setIsSending(false);
      return;
    }

    emailjs.sendForm(serviceId, templateId, form.current, publicKey)
      .then((result) => {
        toast.success(lang === 'en' ? 'Inquiry sent successfully!' : 'पूछताछ सफलतापूर्ंवक भेज दी गई है!');
        form.current.reset();
      }, (error) => {
        toast.error(lang === 'en' ? 'Failed to send. Please try again.' : 'भेजना विफल रहा। कृपया पुनः प्रयास करें।');
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16">
        <div>
          <h1 className="text-4xl font-extrabold mb-6 text-[var(--text-h)]">{t.contact.title}</h1>
          <p className="text-lg text-[var(--text)] mb-8">{t.contact.subtitle}</p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[var(--accent-bg)] flex items-center justify-center rounded-full text-[var(--accent)] text-2xl">
                📍
              </div>
              <div>
                <h3 className="font-bold">{t.contact.address}</h3>
                <p className="text-[var(--text)]">{t.contact.addressVal}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[var(--accent-bg)] flex items-center justify-center rounded-full text-[var(--accent)] text-2xl">
                📞
              </div>
              <div>
                <h3 className="font-bold">{t.contact.phone}</h3>
                <p className="text-[var(--text)] font-semibold text-lg text-[var(--accent)]">+91 {t.contact.phoneVal}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--code-bg)] p-8 rounded-3xl border border-[var(--border)] shadow-xl relative overflow-hidden">
          <h2 className="text-2xl font-bold mb-6 text-[var(--text-h)]">{t.contact.inquiryTitle}</h2>

          <form ref={form} onSubmit={sendEmail} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                required
                name="user_name"
                type="text"
                placeholder={t.contact.namePlac}
                className="w-full px-4 py-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text-h)]"
              />
              <input
                name="parent_name"
                type="text"
                placeholder={t.contact.parentPlac}
                className="w-full px-4 py-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text-h)]"
              />
            </div>
            <input
              required
              name="user_mobile"
              type="tel"
              pattern="[6-9][0-9]{9}"
              maxLength="10"
              minLength="10"
              placeholder={t.contact.mobilePlac}
              className="w-full px-4 py-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text-h)]"
            />
            <input
              name="user_class"
              required
              placeholder={t.contact.selectClass}
              className="w-full px-4 py-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text-h)] appearance-none cursor-pointer"
            />
            <textarea
              name="message"
              required
              placeholder={t.contact.msgPlac}
              rows="4"
              className="w-full px-4 py-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text-h)]"
            ></textarea>

            <button
              disabled={isSending}
              type="submit"
              className={`w-full py-5 bg-[var(--accent)] text-white font-black rounded-2xl shadow-xl hover:shadow-purple-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${isSending ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSending ? (
                <>
                  <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Sending...
                </>
              ) : t.contact.btnSubmit}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
