"use client";

import Link from "next/link";
import { Fragment } from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { sections } from "@/lib/content/schema";
import { segmentLabels } from "./nav";

function labelFor(segment: string, prev?: string) {
  if (prev === "content" && segment in sections) return sections[segment as keyof typeof sections].title;
  if (segmentLabels[segment]) return segmentLabels[segment];
  return "Düzenle";
}

export function AdminBreadcrumb() {
  const segments = usePathname().split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((seg, i) => {
          const href = "/" + segments.slice(0, i + 1).join("/");
          const last = i === segments.length - 1;
          const label = labelFor(seg, segments[i - 1]);
          return (
            <Fragment key={href}>
              {i > 0 && <BreadcrumbSeparator className="hidden md:block" />}
              <BreadcrumbItem className={last ? "" : "hidden md:block"}>
                {last ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={href} />}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
