import { v } from 'convex/values';
import OpenAI from 'openai';
import { api } from './_generated/api';
import { action } from './_generated/server';

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({apiKey});

export const chat = action({
    args:{
        messageBody: v.string(),
        conversation: v.id("conversations"),
    },
    handler:async (ctx, args) => {
        console.log("Called by scheduler to query GPT3.5 ... ")
        const res = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a terse bot in a group chat responding to questions with 1-sentence answers"
                },
                {
                    role: "user",
                    content: args.messageBody,
                }
            ]

        })
        const messageContent = res.choices[0].message.content

        await ctx.runMutation(api.messages.sendChatGPTMessage, {
            content: messageContent ?? "I'm sorry, I can't respond to that",
            conversation: args.conversation,
            messageType: "text",
        })
    }
})

export const dall_e = action({
    args: {
        conversation: v.id("conversations"),
        messageBody: v.string(),
    },
    handler: async (ctx, args) => {
        const res = await openai.images.generate({
            model: "dall-e-2",
            prompt: args.messageBody,
            n:1,
            size : "256x256"
        });

        const imageUrl = res.data[0].url
        await ctx.runMutation(api.messages.sendChatGPTMessage, {
            content: imageUrl ?? "/poopenai.png",
            conversation: args.conversation,
            messageType: "image",
        })

    },
})