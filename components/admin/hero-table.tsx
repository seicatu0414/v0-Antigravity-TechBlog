'use client'

import { useState, useTransition, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ArrowUp, ArrowDown, Trash2, UploadCloud, Loader2 } from 'lucide-react'
import {
    uploadHeroImage,
    deleteHeroImage,
    toggleHeroImageActive,
    updateHeroImagesOrder
} from '@/lib/actions/admin-hero'

type HeroImage = {
    id: string
    url: string
    order: number
    isActive: boolean
}

import { useRouter } from 'next/navigation'

export function HeroTable({ initialImages }: { initialImages: HeroImage[] }) {
    const router = useRouter()
    const [images, setImages] = useState<HeroImage[]>(initialImages)
    const [isPending, startTransition] = useTransition()
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append('image', file)

        try {
            const res = await uploadHeroImage(formData)
            if (res.error) throw new Error(res.error)

            // Reload page to get fresh data
            router.refresh()
        } catch (err: any) {
            alert(err.message)
            setIsUploading(false)
        }
    }

    const handleDelete = (id: string) => {
        if (!confirm('この画像を本当に削除しますか？')) return

        startTransition(async () => {
            try {
                await deleteHeroImage(id)
                setImages(images.filter(img => img.id !== id))
            } catch (err: any) {
                alert(err.message)
            }
        })
    }

    const handleToggleActive = (id: string, current: boolean) => {
        startTransition(async () => {
            try {
                await toggleHeroImageActive(id, !current)
                setImages(images.map(img => img.id === id ? { ...img, isActive: !current } : img))
            } catch (err: any) {
                alert(err.message)
            }
        })
    }

    const handleMove = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === images.length - 1)
        ) return

        const newImages = [...images]
        const swapIndex = direction === 'up' ? index - 1 : index + 1

        // Swap items array order
        const temp = newImages[index]
        newImages[index] = newImages[swapIndex]
        newImages[swapIndex] = temp

        // Update their logical order property
        const updates = newImages.map((img, i) => ({
            id: img.id,
            order: i
        }))

        // Optimistic UI update
        const sortedImages = newImages.map((img, i) => ({ ...img, order: i }))
        setImages(sortedImages)

        startTransition(async () => {
            try {
                await updateHeroImagesOrder(updates)
            } catch (err: any) {
                alert('並び順の保存に失敗しました。ページをリロードしてください。')
            }
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                <Button onClick={handleUploadClick} disabled={isUploading || isPending} className="gap-2">
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                    新規アップロード
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted pb-2 text-muted-foreground font-medium uppercase text-xs border-b">
                                <tr>
                                    <th className="px-6 py-4 w-20">順序</th>
                                    <th className="px-6 py-4">プレビュー</th>
                                    <th className="px-6 py-4 text-center">表示状態</th>
                                    <th className="px-6 py-4 text-right">アクション</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y relative">
                                {images.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                            ヒーロー画像が登録されていません。
                                        </td>
                                    </tr>
                                ) : (
                                    images.map((image, index) => (
                                        <tr key={image.id} className={`hover:bg-muted/50 transition-colors ${isPending ? 'opacity-50' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        disabled={index === 0 || isPending}
                                                        onClick={() => handleMove(index, 'up')}
                                                    >
                                                        <ArrowUp className="h-4 w-4" />
                                                    </Button>
                                                    <span className="font-mono text-xs">{index + 1}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        disabled={index === images.length - 1 || isPending}
                                                        onClick={() => handleMove(index, 'down')}
                                                    >
                                                        <ArrowDown className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-48 h-24 rounded overflow-hidden bg-muted relative border shadow-sm">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={image.url}
                                                        alt={`Hero slide ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Switch
                                                    checked={image.isActive}
                                                    onCheckedChange={() => handleToggleActive(image.id, image.isActive)}
                                                    disabled={isPending}
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    disabled={isPending}
                                                    onClick={() => handleDelete(image.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
