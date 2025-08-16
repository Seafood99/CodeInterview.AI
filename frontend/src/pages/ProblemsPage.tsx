import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  Circle,
  Code,
  Brain,
  ChevronDown,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import PROBLEMS from "../data/problemsData";

const ProblemsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const lang = i18n.language === 'id' ? 'id' : 'en';
  const problems = PROBLEMS.map((p) => {
    const solved = !!localStorage.getItem(`ci_solved_${p.id}`);
    // Dummy acceptance and estimatedTime for demo
    return {
      ...p,
      solved,
      acceptance: 80,
      estimatedTime: "10-20 min",
      tags: p.tags || [],
      title: p.title[lang],
      description: p.description[lang],
    };
  });

  const categories = [
    "Arrays",
    "Linked Lists",
    "Strings",
    "Trees",
    "Stacks",
    "Dynamic Programming",
  ];

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch =
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesDifficulty =
        selectedDifficulty === "all" ||
        problem.difficulty.toLowerCase() === selectedDifficulty;

      const matchesCategory =
        selectedCategory === "all" || problem.category === selectedCategory;

      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [searchTerm, selectedDifficulty, selectedCategory, problems]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 bg-green-100";
      case "Medium":
        return "text-yellow-600 bg-yellow-100";
      case "Hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getAcceptanceColor = (acceptance: number) => {
    if (acceptance >= 80) return "text-green-600";
    if (acceptance >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t("problems.title")}
        </h1>
        <p className="text-gray-600">{t("problems.subtitle")}</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t("problems.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>{t("problems.filters")}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("problems.difficulty")}
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">{t("problems.allDifficulties")}</option>
                  <option value="easy">{t("problems.easy")}</option>
                  <option value="medium">{t("problems.medium")}</option>
                  <option value="hard">{t("problems.hard")}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("problems.category")}
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">{t("problems.allCategories")}</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Problems Grid */}
      <div className="space-y-4">
        {filteredProblems.map((problem) => (
          <div
            key={problem.id}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {problem.solved ? (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {problem.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {problem.description}
                  </p>

                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Code className="h-4 w-4" />
                      <span>{problem.category}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{problem.estimatedTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className={getAcceptanceColor(problem.acceptance)}>
                        {problem.acceptance}% acceptance
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {problem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="ml-6 flex flex-col space-y-2">
                  <Link
                    to={`/interview/${problem.id}`}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium text-center"
                  >
                    {problem.solved
                      ? t("problems.solveAgain")
                      : t("problems.startSolving")}
                  </Link>
                  <button className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm">
                    <Brain className="h-4 w-4" />
                    <span>{t("problems.aiHints")}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProblems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("problems.noProblems")}
          </h3>
          <p className="text-gray-600">{t("problems.tryAdjusting")}</p>
        </div>
      )}
    </div>
  );
};

export default ProblemsPage;
