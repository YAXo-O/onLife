import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';

import { Nullable } from '@app/objects/utility/Nullable';

const id: string = 'default';
const name: string = 'Default Channel';

export interface NotificationConfig {
	title: string;
	body: string;
}

export class NotificationService {
	private static channelId: Nullable<string> = null;
	public static async init(): Promise<void>  {
		await notifee.requestPermission();

		this.channelId = await notifee.createChannel({
			id,
			name,
			vibration: true,
		});
	}

	/**
	 *  Schedule Notification to fire at specific time
	 * @param config	- notification config
	 * @param timestamp	- timestamp (in seconds) when notification should be fired
	 */
	public static async schedule(config: NotificationConfig, timestamp: number): Promise<string> {
		if (this.channelId === null) throw new Error('Unable to send notification - no channel exists');

		const trigger: TimestampTrigger = {
			type: TriggerType.TIMESTAMP,
			timestamp: timestamp * 1000,
		};

		return await notifee.createTriggerNotification({
				title: config.title,
				body: config.body,
				android: {
					channelId: this.channelId,
					pressAction: {
						id: 'default'
					},
				},
			},
			trigger,
		);
	}

	public static async notify(config: NotificationConfig): Promise<string> {
		if (this.channelId === null) throw new Error('Unable to send notification - no channel exists');

		return await notifee.displayNotification({
			title: config.title,
			body: config.body,
			android: {
				channelId: this.channelId,
				pressAction: {
					id: 'default'
				},
			},
		});
	}

	public static async cancel(id: string): Promise<void> {
		await notifee.cancelNotification(id);
	}
}
