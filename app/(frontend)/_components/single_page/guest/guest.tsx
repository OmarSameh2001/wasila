// import {
//   Shield,
//   Users,
//   Zap,
//   CheckCircle,
//   TrendingUp,
//   Clock,
// } from "lucide-react";
// import Link from "next/link";

// export default function GuestHomepage() {
//   return (
//     <div className="min-h-screen">
//       {/* Hero Section */}
//       <section className="mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
//         <div className="text-center">
//           <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
//             From the Brokers,
//             <span className="text-blue-600 dark:text-blue-500">
//               {" "}
//               For the Brokers
//             </span>
//           </h1>
//           <p className="text-xl md:text-2xl text-gray-600 dark:text-blue-100 mb-8 max-w-3xl mx-auto">
//             Your comprehensive platform for instant insurance quotes. Access
//             custom-made and website products all in one place.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
//             <Link href={"/register"}>
//               <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg">
//                 Start Getting Quotes
//               </button>
//             </Link>
//           </div>

//           {/* Trust Badges */}
//           <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-blue-100">
//             <div className="flex items-center gap-2">
//               <CheckCircle className="w-5 h-5 text-green-500" />
//               <span>Instant Quotes and CRM</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <CheckCircle className="w-5 h-5 text-green-500" />
//               <span>50+ Insurance Products</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <CheckCircle className="w-5 h-5 text-green-500" />
//               <span>Instant Products Comparison</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Value Propositions */}
//       <section className="bg-white dark:bg-gray-900 py-20 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
//         <div className="mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
//               Your Insurance Marketplace, Simplified
//             </h2>
//             <p className="text-xl text-gray-600 dark:text-blue-100">
//               Protecting what matters, one quote at a time
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-800 p-8 rounded-xl shadow-sm hover:shadow-md transition">
//               <div className="bg-blue-600 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
//                 <Zap className="w-8 h-8 text-white" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//                 Lightning Fast Quotes
//               </h3>
//               <p className="text-gray-600 dark:text-blue-100 leading-relaxed">
//                 Get instant quote with multi products from multiple providers in
//                 seconds. No more waiting days for comparisons. Your time is
//                 valuable, and we respect that.
//               </p>
//             </div>

//             <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-800 p-8 rounded-xl shadow-sm hover:shadow-md transition">
//               <div className="bg-blue-600 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
//                 <Users className="w-8 h-8 text-white" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//                 Built by Brokers
//               </h3>
//               <p className="text-gray-600 dark:text-blue-100 leading-relaxed">
//                 Designed with real broker workflows in mind. We understand your
//                 challenges because we've been there. Every feature solves a real
//                 problem.
//               </p>
//             </div>

//             <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-800 p-8 rounded-xl shadow-sm hover:shadow-md transition">
//               <div className="bg-blue-600 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
//                 <Shield className="w-8 h-8 text-white" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//                 Comprehensive Coverage
//               </h3>
//               <p className="text-gray-600 dark:text-blue-100 leading-relaxed">
//                 Create your own products or use website's offerings all in one
//                 platform. Your complete insurance solution, simplified and
//                 streamlined.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section
//         id="how-it-works"
//         className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800"
//       >
//         <div className="mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
//               How Wasila Works
//             </h2>
//             <p className="text-xl text-gray-600 dark:text-blue-100">
//               Coverage you can count on, prices you can trust
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-12">
//             <div className="text-center">
//               <div className="bg-blue-100 dark:bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <span className="text-3xl font-bold text-blue-600 dark:text-blue-500">
//                   1
//                 </span>
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
//                 Enter Client Details
//               </h3>
//               <p className="text-gray-600 dark:text-blue-100">
//                 Simply input your client's information and fill product
//                 requirements into our intuitive platform.
//               </p>
//             </div>

//             <div className="text-center">
//               <div className="bg-blue-100 dark:bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <span className="text-3xl font-bold text-blue-600 dark:text-blue-500">
//                   2
//                 </span>
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
//                 Compare Quotes Instantly
//               </h3>
//               <p className="text-gray-600 dark:text-blue-100">
//                 Receive multiple products pricings from various providers
//                 instantly, both custom and standard products.
//               </p>
//             </div>

//             <div className="text-center">
//               <div className="bg-blue-100 dark:bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <span className="text-3xl font-bold text-blue-600 dark:text-blue-500">
//                   3
//                 </span>
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
//                 Close the Deal
//               </h3>
//               <p className="text-gray-600 dark:text-blue-100">
//                 Select the best option for your client and complete the process
//                 seamlessly through our platform.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Additional Benefits */}
//       <section className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
//         <div className="mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-8">
//             <h2 className="text-4xl font-bold mb-4">More Than Just Quotes</h2>
//             <p className="text-xl text-gray-800 dark:text-blue-100">
//               Smart coverage starts here
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//             <div className="text-center">
//               <TrendingUp className="w-12 h-12 mx-auto mb-4" />
//               <h3 className="font-semibold text-lg mb-2">Grow Your Business</h3>
//               <p className="text-gray-600 dark:text-blue-100 text-sm">
//                 Close more deals with faster turnaround times
//               </p>
//             </div>
//             <div className="text-center">
//               <Clock className="w-12 h-12 mx-auto mb-4" />
//               <h3 className="font-semibold text-lg mb-2">Save Time</h3>
//               <p className="text-gray-600 dark:text-blue-100 text-sm">
//                 Reduce quote time from hours to minutes
//               </p>
//             </div>
//             <div className="text-center">
//               <Users className="w-12 h-12 mx-auto mb-4" />
//               <h3 className="font-semibold text-lg mb-2">Better Service</h3>
//               <p className="text-gray-600 dark:text-blue-100 text-sm">
//                 Delight clients with instant comparisons
//               </p>
//             </div>
//             <div className="text-center">
//               <Shield className="w-12 h-12 mx-auto mb-4" />
//               <h3 className="font-semibold text-lg mb-2">Stay Secure</h3>
//               <p className="text-gray-600 dark:text-blue-100 text-sm">
//                 Bank-level security for all your data
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
//             Ready to Transform Your Brokerage?
//           </h2>
//           <p className="text-xl text-gray-600 dark:text-blue-100 mb-8">
//             Join thousands of brokers who trust Wasila for their insurance
//             quoting needs. Experience the difference today.
//           </p>
//           <Link href="/register">
//             <button className="bg-blue-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg">
//               Get Started Free
//             </button>
//           </Link>
//           <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm">
//             No{" "}
//             <span className="font-semibold text-gray-900 dark:text-white underline">
//               credit card
//             </span>{" "}
//             required • Setup in minutes
//           </p>
//         </div>
//       </section>
//     </div>
//   );
// }
