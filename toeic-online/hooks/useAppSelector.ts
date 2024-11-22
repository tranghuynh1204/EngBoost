// hooks/useAppSelector.ts

import { TypedUseSelectorHook, useSelector } from "react-redux";
import type { RootState } from "@/lib/store/store";

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default useAppSelector;
