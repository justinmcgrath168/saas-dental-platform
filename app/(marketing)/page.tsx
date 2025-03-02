import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ArrowRight,
  BarChart3,
  Calendar,
  Users,
  Building2,
  Microscope,
  Stethoscope,
  ShieldCheck,
  Layers,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <header className="bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center text-white text-xl font-bold mr-3">
              D
            </div>
            <span className="text-xl font-bold text-gray-900">DentalHub</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-primary">
              Features
            </Link>
            <Link
              href="#solutions"
              className="text-gray-600 hover:text-primary"
            >
              Solutions
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-primary">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-primary">
              About
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/auth/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero section */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  The Complete Dental Management Ecosystem
                </h1>
                <p className="text-xl text-gray-700 mb-8 max-w-lg">
                  Centralize, digitize, and integrate your dental practice with
                  our all-in-one platform for clinics, labs, imaging centers,
                  and suppliers.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href="/auth/sign-up">
                    <Button size="lg" className="text-md">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#demo">
                    <Button variant="outline" size="lg" className="text-md">
                      Watch Demo
                    </Button>
                  </Link>
                </div>
                <div className="mt-8 flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>No credit card required</span>
                  <span className="mx-3">•</span>
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>14-day free trial</span>
                  <span className="mx-3">•</span>
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Cancel anytime</span>
                </div>
              </div>
              <div className="w-full lg:w-1/2 lg:pl-12">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                  <Image
                    src="/images/landing/dashboard-preview.png"
                    alt="DentalHub Dashboard Preview"
                    width={1000}
                    height={600}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clients section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <p className="text-center text-gray-600 mb-8">
              Trusted by leading dental practices and organizations
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60">
              <Image
                src="/images/landing/client-1.svg"
                alt="Client Logo"
                width={120}
                height={40}
              />
              <Image
                src="/images/landing/client-2.svg"
                alt="Client Logo"
                width={120}
                height={40}
              />
              <Image
                src="/images/landing/client-3.svg"
                alt="Client Logo"
                width={120}
                height={40}
              />
              <Image
                src="/images/landing/client-4.svg"
                alt="Client Logo"
                width={120}
                height={40}
              />
              <Image
                src="/images/landing/client-5.svg"
                alt="Client Logo"
                width={120}
                height={40}
              />
            </div>
          </div>
        </section>

        {/* Features section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                All-in-One Dental Management
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need to streamline your dental practice
                operations, enhance patient care, and grow your business.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Appointment Management
                </h3>
                <p className="text-gray-600">
                  Intuitive scheduling, automated reminders, and real-time
                  availability for efficient appointment management.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Patient Records</h3>
                <p className="text-gray-600">
                  Comprehensive electronic health records with treatment
                  history, medical alerts, and secure document storage.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Business Analytics
                </h3>
                <p className="text-gray-600">
                  Powerful reporting tools and dashboards to track performance,
                  identify trends, and make data-driven decisions.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Microscope className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Lab Integration</h3>
                <p className="text-gray-600">
                  Seamless communication with dental labs, digital
                  prescriptions, and real-time case tracking.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Treatment Planning
                </h3>
                <p className="text-gray-600">
                  Visual treatment planning with detailed odontograms,
                  sequencing, and cost estimation tools.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Security & Compliance
                </h3>
                <p className="text-gray-600">
                  HIPAA-compliant infrastructure with role-based access control
                  and comprehensive audit logging.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Solutions section */}
        <section id="solutions" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tailored Solutions for Dental Businesses
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Specialized features designed for the unique needs of each
                dental business type.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Dental Clinics */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary rounded-md flex items-center justify-center mr-4">
                    <Stethoscope className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold">For Dental Clinics</h3>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      Patient management and electronic health records
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Appointment scheduling with automated reminders</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Treatment planning and tracking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Billing and insurance processing</span>
                  </li>
                </ul>
                <Link href="/solutions/dental-clinics">
                  <Button variant="outline" className="mt-2">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Dental Labs */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary rounded-md flex items-center justify-center mr-4">
                    <Microscope className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold">For Dental Labs</h3>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Digital case submission and management</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Production tracking and workflow optimization</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Quality control and revision management</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Integrated billing and shipping</span>
                  </li>
                </ul>
                <Link href="/solutions/dental-labs">
                  <Button variant="outline" className="mt-2">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Imaging Centers */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary rounded-md flex items-center justify-center mr-4">
                    <Layers className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold">
                    For Imaging Centers
                  </h3>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Digital referral and scheduling system</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Secure image storage and viewing</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Radiologist reporting tools</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Integration with dental practice systems</span>
                  </li>
                </ul>
                <Link href="/solutions/imaging-centers">
                  <Button variant="outline" className="mt-2">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Dental Suppliers */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary rounded-md flex items-center justify-center mr-4">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold">
                    For Dental Suppliers
                  </h3>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Inventory management and forecasting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Order processing and fulfillment</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Customer relationship management</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Direct integration with dental practices</span>
                  </li>
                </ul>
                <Link href="/solutions/dental-suppliers">
                  <Button variant="outline" className="mt-2">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                What Our Customers Say
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Join hundreds of dental professionals who have transformed their
                practice with DentalHub.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl mr-4">
                    S
                  </div>
                  <div>
                    <h4 className="font-bold">Dr. Sarah Mitchell</h4>
                    <p className="text-blue-200">Smile Bright Dental Clinic</p>
                  </div>
                </div>
                <p className="italic text-blue-100">
                  "DentalHub has revolutionized our practice management. The
                  integrated approach has saved us countless hours and reduced
                  errors significantly."
                </p>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl mr-4">
                    J
                  </div>
                  <div>
                    <h4 className="font-bold">James Wilson</h4>
                    <p className="text-blue-200">Elite Dental Laboratory</p>
                  </div>
                </div>
                <p className="italic text-blue-100">
                  "The lab integration features have streamlined our workflow
                  and improved communication with our client clinics. Our
                  turnaround time has decreased by 30%."
                </p>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl mr-4">
                    R
                  </div>
                  <div>
                    <h4 className="font-bold">Dr. Rachel Chen</h4>
                    <p className="text-blue-200">Advanced Dental Imaging</p>
                  </div>
                </div>
                <p className="italic text-blue-100">
                  "The digital referral system has eliminated paperwork and the
                  secure image sharing has made collaboration with dentists
                  seamless. Highly recommended!"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing section */}
        <section id="pricing" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose the plan that works best for your dental business needs.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Starter Plan */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8">
                  <h3 className="text-xl font-semibold mb-2">Starter</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">$49</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    For small practices just getting started
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Up to 5 users</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Patient management</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Appointment scheduling</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Basic reporting</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Email support</span>
                    </li>
                  </ul>
                </div>
                <div className="px-8 pb-8">
                  <Link href="/auth/sign-up?plan=starter">
                    <Button variant="outline" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Professional Plan */}
              <div className="bg-white rounded-lg shadow-xl border-2 border-primary relative transform scale-105">
                <div className="absolute top-0 inset-x-0 bg-primary text-white text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
                <div className="p-8 pt-10">
                  <h3 className="text-xl font-semibold mb-2">Professional</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">$99</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    For growing practices with advanced needs
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Up to 15 users</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Everything in Starter</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Lab integration</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Advanced reporting</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                </div>
                <div className="px-8 pb-8">
                  <Link href="/auth/sign-up?plan=professional">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8">
                  <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">$199</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    For established multi-location practices
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Unlimited users</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Everything in Professional</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Multi-location support</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Custom integrations</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Dedicated account manager</span>
                    </li>
                  </ul>
                </div>
                <div className="px-8 pb-8">
                  <Link href="/auth/sign-up?plan=enterprise">
                    <Button variant="outline" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">
                Need a custom solution for your specific needs?
              </p>
              <Link href="/contact">
                <Button variant="outline">Contact Sales</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-20 bg-gradient-to-r from-primary to-indigo-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Revolutionize Your Dental Practice?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Join thousands of dental professionals who have transformed their
              practices with DentalHub's integrated ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/auth/sign-up">
                <Button size="lg" variant="secondary" className="text-md">
                  Start Your 14-Day Free Trial
                </Button>
              </Link>
              <Link href="/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white hover:bg-white/20 text-md"
                >
                  Schedule a Demo
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-blue-100">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </section>

        {/* Integration section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="w-full lg:w-1/2 mb-12 lg:mb-0 lg:pr-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Seamless Integration Ecosystem
                </h2>
                <p className="text-xl text-gray-600 mb-6">
                  Connect your entire dental workflow with our comprehensive
                  integration platform that brings together clinics, labs,
                  imaging centers, and suppliers.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">
                        Clinic to Lab Communication
                      </h4>
                      <p className="text-gray-600">
                        Digital lab prescriptions, case tracking, and real-time
                        updates
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">
                        Imaging Center Connectivity
                      </h4>
                      <p className="text-gray-600">
                        Digital referrals, image sharing, and report delivery
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">
                        Supply Chain Management
                      </h4>
                      <p className="text-gray-600">
                        Inventory tracking, automated ordering, and delivery
                        management
                      </p>
                    </div>
                  </li>
                </ul>
                <Link href="/integrations">
                  <Button className="mt-6">
                    Explore Integrations
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="w-full lg:w-1/2">
                <Image
                  src="/images/landing/integration-diagram.png"
                  alt="DentalHub Integration Ecosystem"
                  width={600}
                  height={500}
                  className="w-full h-auto rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions about DentalHub's platform.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">
                    How easy is it to migrate from my current software?
                  </h3>
                  <p className="text-gray-600">
                    DentalHub offers comprehensive migration tools and dedicated
                    support to help you transition smoothly. Our team will
                    assist with data import, staff training, and setup to ensure
                    minimal disruption to your practice.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">
                    Is DentalHub compliant with healthcare regulations?
                  </h3>
                  <p className="text-gray-600">
                    Yes, DentalHub is fully HIPAA-compliant and adheres to all
                    relevant healthcare data security standards. We use
                    end-to-end encryption, role-based access control, and
                    comprehensive audit logging to ensure your patient data
                    remains secure.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">
                    Can DentalHub handle multiple locations?
                  </h3>
                  <p className="text-gray-600">
                    Absolutely! Our Enterprise plan is designed specifically for
                    multi-location practices, providing centralized management
                    while allowing location-specific settings, staff access, and
                    reporting.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">
                    Do you offer training and support?
                  </h3>
                  <p className="text-gray-600">
                    Yes, all plans include comprehensive onboarding, training
                    resources, and ongoing support. Our Professional and
                    Enterprise plans include priority support and dedicated
                    account management to ensure your success.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">
                    Can I integrate DentalHub with my existing tools?
                  </h3>
                  <p className="text-gray-600">
                    DentalHub offers integration with popular dental equipment,
                    imaging systems, accounting software, and third-party
                    services. Our Enterprise plan includes custom integration
                    options for specialized needs.
                  </p>
                </div>
              </div>

              <div className="mt-10 text-center">
                <p className="text-gray-600 mb-4">Have more questions?</p>
                <Link href="/faq">
                  <Button variant="outline">View All FAQs</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Start Transforming Your Dental Practice Today
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of dental professionals who have streamlined
                their operations, improved patient care, and grown their
                business with DentalHub.
              </p>
              <Link href="/auth/sign-up">
                <Button size="lg" className="text-md">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <p className="mt-4 text-sm text-gray-500">
                No credit card required. 14-day free trial. Cancel anytime.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center text-white text-xl font-bold mr-3">
                  D
                </div>
                <span className="text-xl font-bold">DentalHub</span>
              </div>
              <p className="text-gray-400 mb-4">
                The complete dental management ecosystem for clinics, labs,
                imaging centers, and suppliers.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/features"
                    className="text-gray-400 hover:text-white"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-gray-400 hover:text-white"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/integrations"
                    className="text-gray-400 hover:text-white"
                  >
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link
                    href="/roadmap"
                    className="text-gray-400 hover:text-white"
                  >
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Solutions</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/solutions/dental-clinics"
                    className="text-gray-400 hover:text-white"
                  >
                    Dental Clinics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/solutions/dental-labs"
                    className="text-gray-400 hover:text-white"
                  >
                    Dental Labs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/solutions/imaging-centers"
                    className="text-gray-400 hover:text-white"
                  >
                    Imaging Centers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/solutions/dental-suppliers"
                    className="text-gray-400 hover:text-white"
                  >
                    Dental Suppliers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-gray-400 hover:text-white"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} DentalHub. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white text-sm"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/security"
                className="text-gray-400 hover:text-white text-sm"
              >
                Security
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
