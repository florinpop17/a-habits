import { relations } from 'drizzle-orm';
import { serial, text, pgTable, integer, timestamp, index } from 'drizzle-orm/pg-core';

// export type Role = 'USER' | 'ADMIN';
// export type Plan = 'BASIC' | 'PREMIUM';

export type AccountType = 'github' | 'google';;

const updateAndCreatedAt = {
    createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
};

export const users = pgTable('user', {
    id: text('id').primaryKey(),
    // role: text('role').$type<Role>().notNull().default('USER'),
    credits: integer('credits').notNull().default(2),
    ...updateAndCreatedAt,
});

export const sessions = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull(),
    ...updateAndCreatedAt,
});

export const accounts = pgTable("account", {
    id: serial("id").primaryKey(),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountType: text("accountType").$type<AccountType>().notNull(),
    githubId: text("githubId").unique(),
    googleId: text("googleId").unique(),
  });

export const habits = pgTable(
    'habits',
    {
        id: serial('id').primaryKey(),
        title: text('title').notNull(),
        description: text('description').notNull(),
        color: text('color').notNull(),
        startDate: timestamp('start_date', { mode: 'string' }).notNull(),
        endDate: timestamp('end_date', { mode: 'string' }).notNull(),
        period: integer('period').notNull(),
        userId: text('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        ...updateAndCreatedAt,
    },
    (table) => {
        return {
            todoUserIdIndex: index('habit_user_id_idx').on(table.userId),
        };
    },
);

export const habitEntries = pgTable(
    'habit_entries',
    {
        id: serial('id').primaryKey(),
        habitId: integer('habit_id')
            .notNull()
            .references(() => habits.id, { onDelete: 'cascade' }),
        date: timestamp('date').notNull(),
        ...updateAndCreatedAt,
    },
    (table) => {
        return {
            habitIdIndex: index('habit_entry_habit_id_idx').on(table.habitId),
        };
    },
);

export const habitsRelations = relations(habits, ({ many, one }) => ({
    habitEntries: many(habitEntries),
    author: one(users, {
        fields: [habits.userId],
        references: [users.id],
    }),
}));

export const habitEntriesRelations = relations(habitEntries, ({ many, one }) => ({
    habit: one(habits, {
        fields: [habitEntries.habitId],
        references: [habits.id],
    }),
}));

// export const userSubscriptions = pgTable('user_subscription', {
//     id: serial('id').primaryKey(),
//     userId: text('user_id').notNull().unique(),
//     stripeCustomerId: text('stripe_customer_id').notNull().unique(),
//     stripeSubscriptionId: text('stripe_subscription_id').notNull().unique(),
//     plan: text('plan').$type<Plan>().notNull(),
//     stripeCurrentPeriodEnd: timestamp('stripe_current_period_end').notNull(),
//     ...updateAndCreatedAt,
// });

export type Habit = typeof habits.$inferSelect;
export type NewHabit = typeof habits.$inferInsert;
