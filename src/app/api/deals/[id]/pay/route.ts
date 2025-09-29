import { NextRequest, NextResponse } from 'next/server'
import { bitrixAPI } from '@/lib/bitrix'
import { getUserByLogin } from '@/lib/database'

export const runtime = 'nodejs'

export async function POST(
	request: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	const { id } = await context.params

	if (!id) {
		return NextResponse.json({ success: false, message: 'Deal ID is required' }, { status: 400 })
	}

	try {
		const user = getUserByLogin('testuser')
		const currentContactId = user?.bitrix_contact_id

		const original = await bitrixAPI.getDeal<unknown>(id)
		if (!original) {
			return NextResponse.json({ success: false, message: 'Original deal not found' }, { status: 404 })
		}

		if (currentContactId) {
			const originalContactId = (original as { CONTACT_ID?: string | number | null } | null)?.CONTACT_ID
			if (String(originalContactId) !== String(currentContactId)) {
				return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
			}
		}

		let targetStage = (await request.json().catch(() => ({})))?.stageId as string | undefined
		if (!targetStage) {
			targetStage = process.env.BITRIX_WORK_STAGE_ID || 'WORK'
		}

		const updated = await bitrixAPI.updateDealStage(id, targetStage)
		if (!updated) {
			return NextResponse.json({ success: false, message: 'Failed to update deal stage' }, { status: 500 })
		}

		return NextResponse.json({ success: true, dealId: id, stageId: targetStage })
	} catch (error: unknown) {
		console.error('POST /api/deals/[id]/pay error:', error)
		return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
	}
}
