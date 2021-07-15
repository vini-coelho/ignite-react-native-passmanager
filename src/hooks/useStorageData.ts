import { useContext } from "react";
import StorageContext from "../context/StorageContext";

export function useStorageData() {
    return useContext(StorageContext);
}