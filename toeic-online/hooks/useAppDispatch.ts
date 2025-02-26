// hooks/useAppDispatch.ts

import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/lib/store/store";

const useAppDispatch: () => AppDispatch = useDispatch;
export default useAppDispatch;
