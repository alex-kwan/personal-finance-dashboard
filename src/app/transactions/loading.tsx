import { ScreenLoadingState } from "../_components/screen-loading-state";

export default function Loading() {
  return (
    <ScreenLoadingState
      title="Transactions"
      description="Loading transaction history..."
      blocks={2}
    />
  );
}