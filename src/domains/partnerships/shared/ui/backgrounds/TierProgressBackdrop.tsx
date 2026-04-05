import React from "react";
import { PartnershipsWaveBackdrop } from "./PartnershipsWaveBackdrop";

type TierProgressBackdropProps = {
  className?: string;
};

/**
 * Preset backdrop matching the Tier Progress screen.
 * Use this anywhere you want the same look without repeating props.
 */
export function TierProgressBackdrop({ className }: TierProgressBackdropProps) {
  return (
    <PartnershipsWaveBackdrop
      className={className}
      strokeColor="#ffc27d"
      waveOpacity={0.7}
      waveBlurPx={2}
      overlayBlurPx={0}
      wavesClassName="h-[115%] w-full"
      overlayClassName="bg-black/45"
    />
  );
}
