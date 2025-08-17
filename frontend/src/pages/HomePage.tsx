import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Code, Brain, Target, BarChart } from "lucide-react";
import GraniteLogoAnimated from "../components/GraniteLogoAnimated";
import { useTranslation } from "react-i18next";

const TypingHero: React.FC<{ text: string; highlight: string }> = ({
  text,
  highlight,
}) => {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const i = useRef(0);
  useEffect(() => {
    setDisplayed("");
    i.current = 0;
    setShowCursor(true);
    const full = text + " " + highlight;
    const interval = setInterval(() => {
      setDisplayed((prev) => {
        if (i.current < full.length) {
          i.current++;
          return full.slice(0, i.current);
        } else {
          clearInterval(interval);
          setTimeout(() => setShowCursor(false), 800);
          return prev;
        }
      });
    }, 60);
    return () => clearInterval(interval);
  }, [text, highlight]);
  return (
    <h1 className="text-5xl font-bold text-gray-900 mb-6">
      {displayed.slice(0, text.length)}
      <span className="text-primary-600">{displayed.slice(text.length)}</span>
      <span
        className={`ml-1 inline-block w-2 h-8 align-middle bg-primary-600 rounded transition-opacity duration-300 ${
          showCursor ? "opacity-100" : "opacity-0"
        }`}
      ></span>
    </h1>
  );
};

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          {t("home.title1")}{" "}
          <span className="text-primary-600">{t("home.title2")}</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          {t("home.subtitle")}
        </p>
  <div className="flex justify-center space-x-4 mb-8">
          <Link
            to="/problems"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 text-lg font-semibold"
          >
            {t("home.startPracticing")}
          </Link>
          <Link
            to="/login"
            className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors duration-200 text-lg font-semibold"
          >
            {t("home.signUpFree")}
          </Link>
        </div>
        <div className="flex justify-center mt-4">
          <GraniteLogoAnimated />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          {t("home.whyChoose")}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {t("home.feature1Title")}
            </h3>
            <p className="text-gray-600">{t("home.feature1Desc")}</p>
          </div>

          <div className="text-center p-6">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {t("home.feature2Title")}
            </h3>
            <p className="text-gray-600">{t("home.feature2Desc")}</p>
          </div>

          <div className="text-center p-6">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {t("home.feature3Title")}
            </h3>
            <p className="text-gray-600">{t("home.feature3Desc")}</p>
          </div>

          <div className="text-center p-6">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {t("home.feature4Title")}
            </h3>
            <p className="text-gray-600">{t("home.feature4Desc")}</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 rounded-xl text-white text-center py-16 px-8">
        <h2 className="text-3xl font-bold mb-4">{t("home.ctaTitle")}</h2>
        <p className="text-xl mb-8 opacity-90">{t("home.ctaDesc")}</p>
        <Link
          to="/login"
          className="bg-white text-primary-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-lg font-semibold"
        >
          {t("home.getStarted")}
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
