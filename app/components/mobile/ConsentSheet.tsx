import { AnimatePresence, motion } from "framer-motion";
import { usePreferences } from "~/hooks";

interface Props {
  open: boolean;
  onDone: () => void;
  onManage: () => void;
}

const ConsentSheet = ({ open, onDone, onManage }: Props) => {
  const { acceptAll, denyAll } = usePreferences();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 35 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-black/10 shadow-xl rounded-t-2xl p-5 pb-8 space-y-4"
        >
          <h2 className="font-semibold text-base">Cookie preferences</h2>
          <p className="text-xs text-black/60 leading-relaxed">
            This site uses self-hosted analytics (Matomo) and optional Google
            Maps. Google Maps enables directions and your live location on the
            map. No data is sold or shared.
          </p>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => { acceptAll(); onDone(); }}
              className="w-full bg-blue-500 text-white rounded-lg py-2.5 text-sm font-medium"
            >
              Accept all
            </button>
            <button
              onClick={() => { denyAll(); onDone(); }}
              className="w-full border border-black/20 rounded-lg py-2.5 text-sm"
            >
              Essential only
            </button>
            <button
              onClick={onManage}
              className="w-full text-xs text-black/50 py-1 underline"
            >
              Manage preferences
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConsentSheet;
