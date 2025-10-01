"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { UserPlus, Users, Wallet, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

// ✅ FIX: correct import name
import { activitiesAPI } from "@/lib/api";

interface Activity {
  id: string;
  type:
    | "customer_approval"
    | "withdrawal_request"
    | "promoter_signup"
    | "season_created";
  description: string;
  timestamp: string;
  status?: "pending" | "approved" | "rejected";
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await activitiesAPI.getAll(); // ✅ FIXED

        const formatted = (data.activities || []).map(
          (a: any, idx: number) => ({
            id: a._id || String(idx),
            type: a.type,
            description: a.description,
            timestamp: a.timestamp
              ? new Date(a.timestamp).toISOString()
              : new Date().toISOString(),
            status: a.status,
          })
        );

        setActivities(formatted);
      } catch (err) {
        console.error("Failed to fetch activities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "withdrawal_request":
        return <Wallet className="h-4 w-4 text-blue-600" />;
      case "customer_approval":
        return <Users className="h-4 w-4 text-purple-600" />;
      case "promoter_signup":
        return <UserPlus className="h-4 w-4 text-green-600" />;
      case "season_created":
        return <Calendar className="h-4 w-4 text-orange-600" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest system activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No recent activity
            </p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="p-2 bg-muted rounded-full">
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp &&
                      !isNaN(new Date(activity.timestamp).getTime())
                        ? formatDistanceToNow(new Date(activity.timestamp), {
                            addSuffix: true,
                          })
                        : "just now"}
                    </p>
                    {activity.status && (
                      <Badge
                        variant="secondary"
                        className={getStatusColor(activity.status)}
                      >
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
