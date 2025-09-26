import { createFileRoute } from '@tanstack/react-router'
import SettingsDisplay from '@/features/settings/display'
import SettingsSelfService from '@/features/settings/self-service'

export const Route = createFileRoute('/_authenticated/settings/self-service')({
  component: SettingsSelfService,
})
