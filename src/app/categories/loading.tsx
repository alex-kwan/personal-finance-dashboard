import { ScreenLoadingState } from "../_components/screen-loading-state";

export default function Loading() {
  return (
    <ScreenLoadingState
      title="Categories"
      description="Loading category management..."
      blocks={3}
    />
  );
}