import * as React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type AvatarProps = React.ComponentProps<typeof Avatar>;

interface AvatarGroupProps extends React.ComponentProps<'div'> {
  children: React.ReactElement<AvatarProps>[];
  max?: number;
}

export const AvatarGroup = ({
  children,
  max,
  className,
  ...props
}: AvatarGroupProps) => {
  const totalAvatars = React.Children.count(children);
  const displayedAvatars = React.Children.toArray(children)
    .slice(0, max)
    .reverse();
  const remainingAvatars = max ? Math.max(totalAvatars - max, 1) : 0;

  return (
    <div
      className={cn('flex items-center flex-row-reverse', className)}
      {...props}
    >
      {remainingAvatars > 0 && (
        <Avatar className="ring-green-500 ring-offset-[3px] h-8 w-8 rounded-full">
          <AvatarFallback className="bg-muted-foreground text-white">
            +{remainingAvatars}
          </AvatarFallback>
        </Avatar>
      )}
      {displayedAvatars.map((avatar, index) => {
        if (!React.isValidElement(avatar)) return null;

        return (
          <div key={index} className="-ml-2 hover:z-10 relative flex">
            {React.cloneElement(avatar as React.ReactElement<AvatarProps>, {
              className: 'ring-green-500 ring-offset-[3px] w-8 h-8',
            })}
          </div>
        );
      })}
    </div>
  );
};
