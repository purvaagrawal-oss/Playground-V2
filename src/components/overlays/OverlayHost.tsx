import { useStore } from '@/store/store'
import { ViewAllUseCases } from './ViewAllUseCases'
import { AssetDetailDrawer } from './AssetDetailDrawer'
import { PreviewPanel } from './PreviewPanel'
import { ReferencePicker } from './ReferencePicker'
import { ElementPicker } from './ElementPicker'
import { CreateElementModal } from './CreateElementModal'
import { EditAssetDrawer } from './EditAssetDrawer'
import { CreateProjectModal } from './CreateProjectModal'
import { GlobalSearch } from './GlobalSearch'

export function OverlayHost() {
  const { state } = useStore()
  const overlay = state.overlay
  if (!overlay) return null

  switch (overlay.type) {
    case 'viewAllUseCases':
      return <ViewAllUseCases />
    case 'assetDetail':
      return <AssetDetailDrawer assetId={overlay.payload?.assetId} />
    case 'preview':
      return <PreviewPanel />
    case 'referencePicker':
      return <ReferencePicker target={overlay.payload?.target ?? 'reference'} />
    case 'elementPicker':
      return <ElementPicker fromAt={overlay.payload?.fromAt} />
    case 'createElement':
      return <CreateElementModal payload={overlay.payload} />
    case 'editAsset':
      return <EditAssetDrawer assetId={overlay.payload?.assetId} />
    case 'createProject':
      return <CreateProjectModal />
    case 'search':
      return <GlobalSearch />
    default:
      return null
  }
}
