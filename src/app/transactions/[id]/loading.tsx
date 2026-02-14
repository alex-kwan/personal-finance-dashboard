import { ScreenLoadingState } from "../../_components/screen-loading-state";

export default function Loading() {
  return (
    <ScreenLoadingState
      title="Transaction Detail"
      description="Loading transaction details..."
      blocks={1}
    />
  );
}