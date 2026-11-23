import RailwayWorld from '@/scenes/RailwayWorld';
import Sidebar from '@/components/panels/Sidebar';
import RightPanel from '@/components/panels/RightPanel';
import BottomBar from '@/components/controls/BottomBar';
import RailwayMap from '@/components/panels/RailwayMap';
import { Map as MapIcon } from 'lucide-react';
import { useStore } from '@/stores/useStore';

export default function OverviewPage() {
  const toggleMap = useStore((s) => s.toggleMap);
  return (
    <div className="rv-page rv-overview">
      <Sidebar />
      <div className="rv-canvas-container">
        <RailwayWorld />
        <button className="rv-map-fab" onClick={toggleMap}>
          <MapIcon size={18} />
          <span>Railway Map</span>
        </button>
      </div>
      <RightPanel />
      <RailwayMap />
      <BottomBar />
    </div>
  );
}
