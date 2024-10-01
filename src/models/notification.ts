interface NotificationProps {
  id: number;
  seller_id?: number | null;
  offer_id?: number | null;
  createdFor: string;
  notification?: string | null;
  is_viewed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class UserNotification {
  id: number;
  seller_id?: number | null;
  offer_id?: number | null;
  createdFor: string;
  notification?: string | null;
  is_viewed: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor({
    id,
    seller_id = null,
    offer_id = null,
    createdFor,
    notification = null,
    is_viewed = false,
    createdAt,
    updatedAt,
  }: NotificationProps) {
    this.id = id;
    this.seller_id = seller_id;
    this.offer_id = offer_id;
    this.createdFor = createdFor;
    this.notification = notification;
    this.is_viewed = is_viewed;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  markAsViewed() {
    this.is_viewed = true;
    this.updatedAt = new Date();
  }

  updateNotification(newNotification: string) {
    this.notification = newNotification;
    this.updatedAt = new Date();
  }
}


export default UserNotification;