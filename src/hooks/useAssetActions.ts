import { useNavigate } from 'react-router-dom'
import { useStore, useToast } from '@/store/store'
import type { Asset, Reference } from '@/types'

function refId() {
  return `ref-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export function useAssetActions() {
  const { dispatch } = useStore()
  const navigate = useNavigate()
  const toast = useToast()

  const focusComposer = () =>
    setTimeout(() => document.getElementById('composer-prompt')?.focus(), 80)

  const recreate = (asset: Asset) => {
    dispatch({ type: 'APPLY_RECREATE', asset })
    navigate(`/create?mode=${asset.type}`)
    toast('Settings restored — ready to recreate', 'success')
    focusComposer()
  }

  const useAsReference = (asset: Asset) => {
    dispatch({ type: 'SET_MODE', mode: asset.type })
    const reference: Reference = {
      id: refId(),
      assetId: asset.id,
      thumbnail: asset.thumbnail,
      label: asset.title,
      role: 'reference',
    }
    dispatch({ type: 'ADD_REFERENCE', mode: asset.type, reference })
    dispatch({ type: 'CLOSE_OVERLAY' })
    navigate(`/create?mode=${asset.type}`)
    toast('Reference attached', 'success')
    focusComposer()
  }

  const download = (asset: Asset) => {
    toast(`Downloading “${asset.title}”…`, 'success')
  }

  const turnIntoVideo = (asset: Asset) => {
    dispatch({ type: 'SET_MODE', mode: 'video' })
    dispatch({ type: 'SELECT_USE_CASE', useCaseId: 'vid-image-to-video' })
    dispatch({
      type: 'SET_CONTROL',
      mode: 'video',
      patch: { aspectRatio: asset.aspectRatio },
    })
    const reference: Reference = {
      id: refId(),
      assetId: asset.id,
      thumbnail: asset.thumbnail,
      label: `${asset.title} (start frame)`,
      role: 'startFrame',
    }
    dispatch({ type: 'ADD_REFERENCE', mode: 'video', reference })
    dispatch({ type: 'CLOSE_OVERLAY' })
    navigate('/create?mode=video')
    toast('Image added as video start frame', 'success')
    focusComposer()
  }

  const continueVideo = (asset: Asset) => {
    dispatch({ type: 'SET_MODE', mode: 'video' })
    dispatch({
      type: 'SET_CONTROL',
      mode: 'video',
      patch: {
        model: asset.model,
        version: asset.version,
        aspectRatio: asset.aspectRatio,
        resolution: asset.resolution,
        duration: asset.duration ?? '5s',
      },
    })
    const reference: Reference = {
      id: refId(),
      assetId: asset.id,
      thumbnail: asset.thumbnail,
      label: `${asset.title} (final frame)`,
      role: 'startFrame',
    }
    dispatch({ type: 'ADD_REFERENCE', mode: 'video', reference })
    dispatch({ type: 'CLOSE_OVERLAY' })
    navigate('/create?mode=video')
    toast('Final frame added as a new starting point', 'success')
    focusComposer()
  }

  const createElement = (asset: Asset) => {
    dispatch({ type: 'OPEN_OVERLAY', overlay: { type: 'createElement', payload: { sourceAssetId: asset.id } } })
  }

  const editAsset = (asset: Asset) => {
    dispatch({ type: 'OPEN_OVERLAY', overlay: { type: 'editAsset', payload: { assetId: asset.id } } })
  }

  const copyPrompt = (asset: Asset) => {
    navigator.clipboard?.writeText(asset.prompt).catch(() => {})
    toast('Prompt copied to clipboard', 'success')
  }

  const moveToProject = (asset: Asset, projectId: string | null) => {
    dispatch({ type: 'UPDATE_ASSET', id: asset.id, patch: { projectId } })
    toast('Moved to project', 'success')
  }

  const toggleFavourite = (asset: Asset) => {
    dispatch({ type: 'TOGGLE_FAVOURITE', id: asset.id })
    toast(asset.favourite ? 'Removed from favourites' : 'Added to favourites', 'info')
  }

  const deleteAsset = (asset: Asset) => {
    dispatch({ type: 'REMOVE_ASSET', id: asset.id })
    dispatch({ type: 'CLOSE_OVERLAY' })
    toast('Asset deleted', 'info')
  }

  const openDetail = (asset: Asset) => {
    dispatch({ type: 'OPEN_OVERLAY', overlay: { type: 'assetDetail', payload: { assetId: asset.id } } })
  }

  return {
    recreate,
    useAsReference,
    download,
    turnIntoVideo,
    continueVideo,
    createElement,
    editAsset,
    copyPrompt,
    moveToProject,
    toggleFavourite,
    deleteAsset,
    openDetail,
  }
}
