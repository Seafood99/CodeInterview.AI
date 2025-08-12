import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Brain, Target, BarChart } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Master Your <span className="text-primary-600">Code Interviews</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Practice coding interviews with AI-powered feedback, real-time hints, and 
          comprehensive performance analytics. Get ready for your dream tech job.
        </p>
        <div className="space-y-4">
          <Link
            to="/problems"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 text-lg font-semibold"
          >
            Start Practicing
          </Link>
          <Link
            to="/login"
            className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors duration-200 text-lg font-semibold"
          >
            Sign Up Free
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose CodeInterview.AI?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Real-time Code Editor
            </h3>
            <p className="text-gray-600">
              Professional IDE experience with syntax highlighting, auto-completion, and error detection.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              AI-Powered Hints
            </h3>
            <p className="text-gray-600">
              Get intelligent hints and suggestions powered by IBM Granite AI to improve your problem-solving.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Mock Interviews
            </h3>
            <p className="text-gray-600">
              Simulate real interview conditions with timed sessions and pressure scenarios.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Performance Analytics
            </h3>
            <p className="text-gray-600">
              Track your progress with detailed analytics and personalized improvement recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 rounded-xl text-white text-center py-16 px-8">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Ace Your Next Interview?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of developers who landed their dream jobs with our platform.
        </p>
        <Link
          to="/login"
          className="bg-white text-primary-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-lg font-semibold"
        >
          Get Started Today
        </Link>
      </div>
    </div>
  );
};

export default HomePage;