'use client'

import { useState } from 'react'

import { Popup } from '../ui/popup'
import { Button } from '../ui/button'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function DonationPopup() {
  const t = useTranslations('donationPopup')
  const [showPopup, setShowPopup] = useState(true)

  if (!showPopup) return null

  return (
    <Popup
      show={showPopup}
      setShow={setShowPopup}
      id="donation-popup"
      title="A note from the developer"
    >
      <div className="flex flex-col gap-2 text-center">
        <p className="text-sm text-balance max-w-xl">{t('message')}</p>

        {/* Donation Links */}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="https://github.com/sponsors/mateo-leal"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button>{t('ghSponsors')}</Button>
          </Link>
          <Link
            href="https://www.paypal.com/donate/?hosted_button_id=SZCHE6EGL2FYC"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button variant="outline">{t('paypal')}</Button>
          </Link>
        </div>
      </div>
    </Popup>
  )
}
