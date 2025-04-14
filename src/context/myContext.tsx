import { createContext } from 'react';

interface ContextType {
  mode: 'light' | 'dark';
  toggleMode: () => void;
}

const MyContext = createContext<ContextType | undefined>(undefined);

export default MyContext;
