import { Card, CardContent } from "@/components/ui/card";
import { EducationTitleFormValues } from "../../schema";
import { TypographyP } from "@/components/ui/typography/typography-p";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PencilIcon, Trash2Icon } from "lucide-react";
import {
  BADGE_COLORS,
  educationStatusLabels,
  educationTypeLabels,
} from "./constants";

interface EducationCardProps {
  titles: EducationTitleFormValues[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export const EducationCard = ({
  titles,
  onEdit,
  onDelete,
}: EducationCardProps) => {
  return (
    <div className="space-y-3">
      {titles.map((educationTitle, index) => (
        <Card key={`${educationTitle.title}-${index}`}>
          <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div>
                <h4 className="font-medium">{educationTitle.title}</h4>
                {educationTitle.document ? (
                  <TypographyP className="text-sm text-muted-foreground">
                    {typeof educationTitle.document === "string"
                      ? educationTitle.document
                      : educationTitle.document.name}
                  </TypographyP>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={BADGE_COLORS[educationTitle.status]}>
                  {educationStatusLabels[educationTitle.status]}
                </Badge>
                <Badge variant="outline">
                  {educationTypeLabels[educationTitle.type]}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2 self-end sm:self-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => onEdit(index)}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => onDelete(index)}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
