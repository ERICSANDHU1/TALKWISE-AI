import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const CreateNewRoom = mutation({
  args: {
    ExpertsExpert: v.string(),
    topic: v.string(),
    expertType: v.string(),
    // uid: (v.id('users'))
     uid: v.optional(v.id('users'))
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert('DiscussionRoom', {
      ExpertsExpert: args.ExpertsExpert,
      topic: args.topic,
      expertType: args.expertType,
      uid: args.uid
    });

    return result;
  }
});

export const GetDiscussionRoom = query({
  args: {
    id: v.id('DiscussionRoom')
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.get(args.id);
    return result;
  }
});

export const UpdateConversation=mutation({
  args:{
    id:v.id('DiscussionRoom'),
    conversation:v.any()
  },
  handler:async(ctx,args)=>{
    await ctx.db.patch(args.id,{
      conversation:args.conversation
    })
  }
})
export const UpdateSummery=mutation({
  args:{
    id:v.id('DiscussionRoom'),
    summery:v.any()
  },
  handler:async(ctx,args)=>{
    await ctx.db.patch(args.id,{
      summery:args.summery
    })
  }
})

export const GetAllDiscussionRoom = query({
  args: {
    uid: v.optional(v.id('users'))
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.query('DiscussionRoom')
    .filter(q=>q.eq(q.field('uid'),args.uid)).collect();

    return result;
  }
});
