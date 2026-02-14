import { ScreenLoadingState } from "../_components/screen-loading-state";

export default function Loading() {
  return (
    <ScreenLoadingState
      title="Dashboard"
      description="Loading your financial overview..."
      blocks={2}
    />
  );
}