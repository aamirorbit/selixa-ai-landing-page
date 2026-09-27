# /contact — copy sheet

The inquiry form as a full page (SITE_PLAN §8), for direct links and people who'd rather skip the modal. Reuses `components/InquiryForm.tsx` unchanged; only the heading, intro and submit label are passed in.

---

## Page metadata

- **`<title>`:** Contact — Selixa
- **Meta description:** Tell us what you're building. We'll set you up with Selixa, your AI Product Manager.
- **OG title:** Contact Selixa
- **OG description:** Tell us what you're building.

---

## Hero

- **Eyebrow:** Contact
- **Headline:** talk to us.
- **Line:** Tell us what you’re building. We’ll take it from there.

## Form (`InquiryForm` props)

- **heading:** Get started with Selixa *(reuse)*
- **intro:** Tell us what you’re building. **We’ll set you up with your AI Product Manager.** *(reuse)*
- **submitLabel:** Request access *(reuse)*
- **Fields, errors, privacy line, success state:** unchanged from `InquiryForm` / `app/actions.ts`.

If the hero already says "Tell us what you're building", the Designer may drop the hero line or pass a shorter intro; don't repeat it twice on screen.

## Other ways to reach us

- **Label:** Prefer email?
- **Address:** TODO(owner): support email to list. (hello@selixa.ai already appears in the form's error messages; confirm if that's the one.) Leave this row out until confirmed.

---

## Notes

- No office address, phone, social links or response-time promise beyond the form's own success message ("within two business days").
