import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link
        to="/"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-uoft-blue font-semibold mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 card-shadow border border-blue-100 dark:border-slate-700">
        <h1 className="text-2xl sm:text-3xl font-black text-uoft-blue dark:text-white mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">Last updated: September 12, 2026</p>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          <p>
            These Terms of Service govern your use of UofT Flow, operated by Joey. By accessing or
            using the Service, you agree to be bound by these Terms. If you do not agree, do not use
            the Service.
          </p>

          <section>
            <h2 className="text-lg font-bold text-uoft-blue mt-6 mb-2">1. Eligibility</h2>
            <p>
              You must be at least 13 years old to use the Service. If you are under the age of
              majority in your province, you may only use the Service with the involvement of a
              parent or guardian.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-uoft-blue mt-6 mb-2">
              2. Not an Official University Service
            </h2>
            <p>
              The Service is an independent, student-built project. It is not owned, operated,
              endorsed, or affiliated with the University of Toronto in any official capacity.
              References to "UofT" are used solely to describe the Service's intended user base and
              campus locations, not to imply institutional endorsement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-uoft-blue mt-6 mb-2">3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and
              for all activity under your account. Notify us immediately of any unauthorized use.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-uoft-blue mt-6 mb-2">
              4. User Generated Content
            </h2>
            <p>
              The Service allows you to submit ratings, reviews, photos, and other content ("User
              Content") related to campus facilities.
            </p>

            <h3 className="font-bold text-uoft-blue mt-4 mb-1">4.1 Ownership</h3>
            <p>
              You retain ownership of your User Content. By submitting it, you grant us a
              non-exclusive, worldwide, royalty-free license to host, display, reproduce, and
              distribute it within the Service.
            </p>

            <h3 className="font-bold text-uoft-blue mt-4 mb-1">4.2 Prohibited Content</h3>
            <p>You agree not to submit content that:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Is false, misleading, or submitted in bad faith</li>
              <li>Identifies, names, or targets a specific individual, including staff or other students</li>
              <li>Is defamatory, harassing, obscene, or discriminatory</li>
              <li>Contains personal information about another person without their consent</li>
              <li>Infringes on any third party's intellectual property rights</li>
              <li>Violates any applicable law, including Ontario and federal Canadian law</li>
            </ul>

            <h3 className="font-bold text-uoft-blue mt-4 mb-1">4.3 Moderation</h3>
            <p>
              We reserve the right, but assume no obligation, to review, edit, remove, or refuse any
              User Content at our sole discretion, without prior notice.
            </p>

            <h3 className="font-bold text-uoft-blue mt-4 mb-1">4.4 Reporting</h3>
            <p>
              Users may report content they believe violates these Terms. We will review reports on a
              reasonable effort basis but do not guarantee a specific response time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-uoft-blue mt-6 mb-2">
              5. Accuracy of Content
            </h2>
            <p>
              Facility conditions change over time. Ratings, cleanliness scores, and location
              information are user-submitted and may be outdated, inaccurate, or subjective. We make
              no representation as to the accuracy, completeness, or reliability of any content on
              the Service. Use the Service at your own discretion.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-uoft-blue mt-6 mb-2">6. Location Data</h2>
            <p>
              The Service collects your device location to provide proximity-based sorting of
              facilities. Location data is only collected with your explicit consent, obtained through
              your device's permission settings. You may revoke this permission at any time through
              your device settings, though doing so may limit certain features.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-uoft-blue mt-6 mb-2">7. Donations</h2>
            <p>
              The Service may include a link to a third-party donation platform (Ko-fi). Donations are
              voluntary, processed entirely by the third-party platform, and are not refundable
              through us. We are not responsible for the donation platform's terms, security, or
              handling of payment information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-uoft-blue mt-6 mb-2">
              8. Disclaimer of Warranties
            </h2>
            <p>
              The Service is provided "as is" and "as available" without warranties of any kind,
              express or implied, including but not limited to warranties of accuracy, merchantability,
              fitness for a particular purpose, or non-infringement. We do not guarantee the Service
              will be uninterrupted, secure, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-uoft-blue mt-6 mb-2">
              9. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, we are not liable for any indirect, incidental,
              special, consequential, or punitive damages arising from your use of the Service,
              including but not limited to reliance on inaccurate facility ratings or exposure to
              unsanitary conditions. Our total liability for any claim arising from the Service will
              not exceed the greater of the amount you paid us in the past twelve months (if any) or
              fifty Canadian dollars.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-uoft-blue mt-6 mb-2">10. Indemnification</h2>
            <p>
              You agree to indemnify and hold us harmless from any claims, damages, or expenses,
              including legal fees, arising from your User Content, your violation of these Terms, or
              your violation of any third-party right.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-uoft-blue mt-6 mb-2">11. Termination</h2>
            <p>
              We may suspend or terminate your access to the Service at any time, with or without
              cause or notice, including for violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-uoft-blue mt-6 mb-2">
              12. Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time. Continued use of the Service after changes
              take effect constitutes acceptance of the revised Terms. Material changes will be
              flagged within the app.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-uoft-blue mt-6 mb-2">13. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the Province of Ontario and the federal laws of
              Canada applicable therein, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-uoft-blue mt-6 mb-2">14. Contact</h2>
            <p>
              Questions about these Terms can be directed to{' '}
              <a href="mailto:hailtothe5th@gmail.com" className="text-uoft-blue hover:underline font-semibold">
                hailtothe5th@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
