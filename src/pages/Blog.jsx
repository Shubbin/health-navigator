import { Newspaper, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Blog = () => {
  const articles = [
    {
      id: 1,
      title: "Understanding Eye Health: Common Signs of Strain",
      excerpt: "Learn to recognize early warning signs of digital eye strain and how to protect your vision in the digital age.",
      category: "Eye Health",
      readTime: "5 min read",
      featured: true,
    },
    {
      id: 2,
      title: "Medication Adherence: Why It Matters",
      excerpt: "Discover the importance of taking medications and tips to never miss a dose.",
      category: "Wellness",
      readTime: "4 min read",
      featured: false,
    },
    {
      id: 3,
      title: "Preventive Care for Young Adults in Nigeria",
      excerpt: "Essential health screenings and lifestyle habits that every young Nigerian should prioritize.",
      category: "Preventive Care",
      readTime: "7 min read",
      featured: false,
    },
    {
      id: 4,
      title: "Dental Hygiene Best Practices",
      excerpt: "Simple daily routines that can significantly improve your oral health and prevent common dental issues.",
      category: "Dental Health",
      readTime: "6 min read",
      featured: false,
    },
    {
      id: 5,
      title: "When to Consult a Doctor: Warning Signs",
      excerpt: "Learn to distinguish between minor health concerns and symptoms that require immediate medical attention.",
      category: "Healthcare",
      readTime: "8 min read",
      featured: false,
    },
  ];

  const categories = ["All", "Eye Health", "Dental Health", "Wellness", "Preventive Care", "Healthcare"];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="text-primary hover:underline text-sm mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Health Blog</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Intro */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-3">Learn About Your Health</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Evidence-based articles to help you make informed decisions about preventive care and wellness
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                size="sm"
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Featured Article */}
          {articles.find((a) => a.featured) && (
            <Card className="mb-8 border-primary/20 hover:shadow-lg transition-all">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-primary/10 text-primary border-primary/20">Featured</Badge>
                <CardTitle className="text-2xl">{articles.find((a) => a.featured)?.title}</CardTitle>
                <CardDescription className="text-base">
                  {articles.find((a) => a.featured)?.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Badge variant="outline">{articles.find((a) => a.featured)?.category}</Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {articles.find((a) => a.featured)?.readTime}
                    </span>
                  </div>
                  <Button>
                    Read More
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Article Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles
              .filter((a) => !a.featured)
              .map((article) => (
                <Card
                  key={article.id}
                  className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
                >
                  <CardHeader>
                    <Badge variant="outline" className="w-fit mb-2">
                      {article.category}
                    </Badge>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription>{article.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </span>
                      <Button variant="ghost" size="sm" className="group-hover:text-primary">
                        Read
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* CTA Section */}
          <Card className="mt-12 bg-primary/5 border-primary/20">
            <CardHeader className="text-center">
              <Newspaper className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl">Stay Informed</CardTitle>
              <CardDescription className="text-base">
                Subscribe to receive weekly health tips and the latest articles delivered to your inbox
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Subscribe to Newsletter
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Blog;
