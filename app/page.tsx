import { GradientHeader } from "@/components/gradient-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  BarChart,
  Map,
  MessageSquare,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { SubmitFeedbackButton } from "@/components/submit-feedback-button";

export default async function HomePage() {

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <GradientHeader
        title="From Feedback to Features — Faster!"
        subtitle="Let users suggest ideas, vote on priorities, and track what's coming next."
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-6">
          <SubmitFeedbackButton
            size="default"
            className="bg-white text-blue-600 hover:bg-gray-100 cursor-pointer w-full sm:w-auto text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-8"
          >
            Submit Feedback <ArrowRight className="ml-2 h-4 w-4" />
          </SubmitFeedbackButton>
          <Button
            asChild
            size="default"
            className="bg-white text-black hover:bg-gray-100 w-full sm:w-auto text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-8"
          >
            <Link href="/roadmap">
              View Roadmap <Map className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </GradientHeader>
      {/* Feature Section */}
      <section>
        <h2 className="text-3xl font-bond text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <MessageSquare className=" h-8 w-8 text-primary mb-2" />
              <CardTitle>Gather Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Capture user feedback and feature suggestions effortlessly.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <BarChart className=" h-8 w-8 text-primary mb-2" />
              <CardTitle>Vote & Prioritize</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Turn user votes into clear product priorities.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Users className=" h-8 w-8 text-primary mb-2" />
              <CardTitle>Track Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Let users stay updated on what's being built.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Zap className=" h-8 w-8 text-primary mb-2" />
              <CardTitle>Ship with Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Build and release features backed by real user demand.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
