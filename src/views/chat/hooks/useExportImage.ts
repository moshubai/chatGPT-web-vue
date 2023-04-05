import { useDialog, useMessage } from 'naive-ui'
import html2canvas from 'html2canvas'
import { t } from '@/locales'

interface ScrollReturn {
  handleExportFn: () => {}
}

export function useExportImage(): ScrollReturn {
  const ms = useMessage()
  const dialog = useDialog()
  const handleExportFn = async () => {
    const d = dialog.warning({
      title: t('chat.exportImage'),
      content: t('chat.exportImageConfirm'),
      positiveText: t('common.yes'),
      negativeText: t('common.no'),
      onPositiveClick: async () => {
        try {
          d.loading = true
          const ele = document.getElementById('image-wrapper')
          const canvas = await html2canvas(ele as HTMLDivElement, {
            useCORS: true,
          })
          const imgUrl = canvas.toDataURL('image/png')
          const tempLink = document.createElement('a')
          tempLink.style.display = 'none'
          tempLink.href = imgUrl
          tempLink.setAttribute('download', 'chat-shot.png')
          if (typeof tempLink.download === 'undefined')
            tempLink.setAttribute('target', '_blank')

          document.body.appendChild(tempLink)
          tempLink.click()
          document.body.removeChild(tempLink)
          window.URL.revokeObjectURL(imgUrl)
          d.loading = false
          ms.success(t('chat.exportSuccess'))
          Promise.resolve()
        }
        catch (error: any) {
          console.error('error', error)
          ms.error(t('chat.exportFailed'))
        }
        finally {
          d.loading = false
        }
      },
    })
  }

  return {
    handleExportFn,
  }
}
