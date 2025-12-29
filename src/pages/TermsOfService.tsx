const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="mb-4">
        Welcome to our application. By using our services, you agree to the
        following terms and conditions.
      </p>
      <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
      <p className="mb-4">
        By accessing or using our services, you agree to be bound by these
        terms. If you do not agree, please do not use our services.
      </p>
      <h2 className="text-2xl font-semibold mb-2">2. Changes to Terms</h2>
      <p className="mb-4">
        We reserve the right to modify these terms at any time. Changes will be
        effective immediately upon posting.
      </p>
      <h2 className="text-2xl font-semibold mb-2">3. User Responsibilities</h2>
      <p className="mb-4">
        You agree to use our services responsibly and comply with all applicable
        laws and regulations.
      </p>
      <h2 className="text-2xl font-semibold mb-2">
        4. Limitation of Liability
      </h2>
      <p className="mb-4">
        We are not liable for any damages arising from your use of our services.
      </p>
      <h2 className="text-2xl font-semibold mb-2">5. Contact Us</h2>
      <p className="mb-4">
        If you have any questions about these terms, please contact us at{' '}
        <a
          href="mailto:support@example.com"
          className="text-blue-500 underline"
        >
          mark@marknigh.com
        </a>
        .
      </p>
    </div>
  );
};

export default TermsOfService;
