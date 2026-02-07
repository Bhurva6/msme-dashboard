import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, FileText, Building2, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="container-custom py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              MSME Funding Made Simple
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Get funding in <span className="font-bold">20 minutes</span>, not 20 hours
            </p>
            <p className="text-lg mb-12 text-primary-50 max-w-2xl mx-auto">
              One profile, multiple banks. Stop repeating the same paperwork. Let us create a bank-ready case file for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="btn-primary bg-white text-primary hover:bg-gray-100 shadow-xl text-lg px-8 py-4 flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="btn-secondary bg-primary-500 hover:bg-primary-600 text-white shadow-xl text-lg px-8 py-4"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="card hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                One Profile, Multiple Banks
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Fill your business details once and get matched with multiple lending partners instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Save 20+ Hours of Paperwork
              </h3>
              <p className="text-gray-600 leading-relaxed">
                No more repeating the same information across different platforms. We do it once, we do it right.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Bank-Ready Case Files
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our ops team creates professional case files that banks love, increasing your approval chances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center card bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-100">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join hundreds of MSMEs who have simplified their funding journey
            </p>
            <Link
              to="/signup"
              className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
            >
              Create Your Profile <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container-custom">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <p className="text-gray-400">© 2026 MSME Funding Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
