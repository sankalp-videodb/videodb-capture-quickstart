/**
 * Cue Card Overlay Component
 *
 * Displays objection handling cue cards with:
 * - Talk tracks
 * - Follow-up questions
 * - Pin/dismiss/feedback actions
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import {
  X,
  Pin,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  XCircle,
} from 'lucide-react';
import { useCopilotStore } from '../../stores/copilot.store';
import { useCopilot } from '../../hooks/useCopilot';
import { cn } from '../../lib/utils';
import type { CopilotCueCard } from '../../../shared/types/ipc.types';

// ============================================================================
// Sub-components
// ============================================================================

interface CueCardItemProps {
  cueCard: CopilotCueCard;
  isPinned?: boolean;
  onDismiss: (triggerId: string) => void;
  onPin: (triggerId: string) => void;
  onFeedback: (triggerId: string, feedback: 'helpful' | 'wrong' | 'irrelevant') => void;
}

function CueCardItem({ cueCard, isPinned, onDismiss, onPin, onFeedback }: CueCardItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);

  const getObjectionIcon = (type: string) => {
    switch (type) {
      case 'pricing':
        return '💰';
      case 'timing':
        return '⏰';
      case 'competitor':
        return '🏢';
      case 'authority':
        return '👔';
      case 'security':
        return '🔒';
      case 'integration':
        return '🔗';
      default:
        return '💬';
    }
  };

  const getObjectionColor = (type: string) => {
    switch (type) {
      case 'pricing':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'timing':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'competitor':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'authority':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'security':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <Card className={cn(
      "border-l-4 transition-all duration-300",
      isPinned ? "border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20" : "border-l-amber-500"
    )}>
      <CardHeader className="pb-2 pt-3 px-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-lg">{getObjectionIcon(cueCard.objectionType)}</span>
            <div className="min-w-0">
              <CardTitle className="text-sm font-semibold truncate">
                {cueCard.title}
              </CardTitle>
              <Badge className={cn("text-xs mt-1", getObjectionColor(cueCard.objectionType))}>
                {cueCard.objectionType}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
            {!isPinned && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onPin(cueCard.triggerId)}
              >
                <Pin className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onDismiss(cueCard.triggerId)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Trigger text */}
        <div className="mt-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground italic">
          "{cueCard.triggerText.substring(0, 100)}{cueCard.triggerText.length > 100 ? '...' : ''}"
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 px-3 pb-3 space-y-3">
          {/* Talk Tracks */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              Say This
            </p>
            <ul className="space-y-1">
              {cueCard.talkTracks.slice(0, 3).map((track, i) => (
                <li key={i} className="text-sm pl-3 border-l-2 border-green-400 py-0.5">
                  {track}
                </li>
              ))}
            </ul>
          </div>

          {/* Follow-up Questions */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1">
              <HelpCircle className="h-3 w-3" />
              Ask This
            </p>
            <ul className="space-y-1">
              {cueCard.followUpQuestions.slice(0, 2).map((question, i) => (
                <li key={i} className="text-sm pl-3 border-l-2 border-blue-400 py-0.5">
                  {question}
                </li>
              ))}
            </ul>
          </div>

          {/* Avoid Saying (if present) */}
          {cueCard.avoidSaying && cueCard.avoidSaying.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                <XCircle className="h-3 w-3 text-red-500" />
                Avoid Saying
              </p>
              <ul className="space-y-1">
                {cueCard.avoidSaying.slice(0, 2).map((avoid, i) => (
                  <li key={i} className="text-sm pl-3 border-l-2 border-red-400 py-0.5 text-muted-foreground">
                    {avoid}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Feedback */}
          <div className="pt-2 border-t">
            {!showFeedback ? (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7"
                onClick={() => setShowFeedback(true)}
              >
                Was this helpful?
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Rate this:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    onFeedback(cueCard.triggerId, 'helpful');
                    setShowFeedback(false);
                  }}
                >
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  Helpful
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    onFeedback(cueCard.triggerId, 'wrong');
                    setShowFeedback(false);
                  }}
                >
                  <ThumbsDown className="h-3 w-3 mr-1" />
                  Wrong
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// ============================================================================
// Main Component
// ============================================================================

interface CueCardOverlayProps {
  className?: string;
  maxCards?: number;
}

export function CueCardOverlay({ className, maxCards = 3 }: CueCardOverlayProps) {
  const { activeCueCards, pinnedCueCards, isCallActive } = useCopilotStore();
  const { dismissCueCard, pinCueCard, submitCueCardFeedback } = useCopilot();

  const allCards = [...pinnedCueCards, ...activeCueCards.slice(0, maxCards - pinnedCueCards.length)];

  if (!isCallActive || allCards.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-medium">Objection Handling</span>
        </div>
        <Badge variant="secondary" className="text-xs">
          {allCards.length} active
        </Badge>
      </div>

      <ScrollArea className="max-h-[400px]">
        <div className="space-y-2 pr-2">
          {allCards.map((card) => (
            <CueCardItem
              key={card.triggerId}
              cueCard={card}
              isPinned={card.status === 'pinned'}
              onDismiss={dismissCueCard}
              onPin={pinCueCard}
              onFeedback={submitCueCardFeedback}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default CueCardOverlay;
