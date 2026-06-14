"use client"

import { useState, useEffect, useRef } from "react"
import { usePusher } from "@/components/providers/PusherProvider"
import { addComment, getComments, triggerTyping } from "@/actions/comments"
import { Send, User as UserIcon } from "lucide-react"

type Comment = {
  id: string
  text: string
  createdAt: Date
  user: {
    id: string
    name: string | null
    image: string | null
  }
}

type TypingUser = {
  userId: string
  userName: string | null
}

export function TaskComments({ taskId, organizationId }: { taskId: string, organizationId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newContent, setNewContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const { pusherClient } = usePusher()
  const scrollRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Fetch initial comments
    getComments(taskId).then(res => {
      if (res.success && res.comments) {
        setComments(res.comments as Comment[])
      }
    })
  }, [taskId])

  useEffect(() => {
    if (!pusherClient) return

    const channelName = `private-org-${organizationId}`
    const channel = pusherClient.channel(channelName) || pusherClient.subscribe(channelName)

    channel.bind(`task-comment-${taskId}`, (newComment: Comment) => {
      setComments(prev => {
        if (prev.find(c => c.id === newComment.id)) return prev
        return [...prev, newComment]
      })
    })

    channel.bind(`task-typing-${taskId}`, (data: { userId: string, userName: string | null, isTyping: boolean }) => {
      setTypingUsers(prev => {
        if (data.isTyping) {
          if (prev.find(u => u.userId === data.userId)) return prev
          return [...prev, { userId: data.userId, userName: data.userName }]
        } else {
          return prev.filter(u => u.userId !== data.userId)
        }
      })
    })

    return () => {
      channel.unbind(`task-comment-${taskId}`)
      channel.unbind(`task-typing-${taskId}`)
    }
  }, [pusherClient, organizationId, taskId])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [comments, typingUsers])

  let typingTimeout: NodeJS.Timeout
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewContent(e.target.value)
    
    // Trigger typing event
    triggerTyping(taskId, true)
    
    clearTimeout(typingTimeout)
    typingTimeout = setTimeout(() => {
      triggerTyping(taskId, false)
    }, 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newContent.trim() || isSubmitting) return

    setIsSubmitting(true)
    const res = await addComment(taskId, newContent)
    if (res.success) {
      setNewContent("")
      triggerTyping(taskId, false)
    }
    setIsSubmitting(false)
  }

  return (
    <div className="flex flex-col h-full bg-white/[0.02] border border-white/5 rounded-xl mt-6 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 bg-white/[0.01]">
        <h3 className="text-sm font-semibold text-neutral-300">Comments</h3>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[250px]" ref={scrollRef}>
        {comments.length === 0 ? (
          <div className="text-center text-xs text-neutral-500 py-4">No comments yet.</div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {comment.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={comment.user.image} alt={comment.user.name || "User"} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-4 h-4 text-neutral-400" />
                )}
              </div>
              <div className="flex flex-col bg-white/[0.04] p-3 rounded-2xl rounded-tl-sm w-full">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{comment.user.name}</span>
                  <span className="text-[10px] text-neutral-500">{new Date(comment.createdAt).toLocaleTimeString()}</span>
                </div>
                <p className="text-sm text-neutral-300">{comment.text}</p>
              </div>
            </div>
          ))
        )}

        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-neutral-500 italic">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-[#22D3EE] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-[#22D3EE] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-[#22D3EE] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            {typingUsers.map(u => u.userName).join(", ")} {typingUsers.length > 1 ? "are" : "is"} typing...
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/10 bg-white/[0.02]">
        <form onSubmit={handleSubmit} className="flex gap-2 relative">
          <input 
            type="text" 
            value={newContent}
            onChange={handleTyping}
            placeholder="Write a comment..."
            disabled={isSubmitting}
            className="flex-1 bg-white/[0.05] border border-white/10 rounded-full pl-4 pr-10 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#22D3EE] placeholder:text-neutral-500"
          />
          <button 
            type="submit" 
            disabled={!newContent.trim() || isSubmitting}
            className="absolute right-1 top-1 bottom-1 w-8 rounded-full bg-[#22D3EE] flex items-center justify-center text-[#070B14] hover:bg-[#06B6D4] disabled:opacity-50 disabled:hover:bg-[#22D3EE] transition-colors"
          >
            <Send className="w-4 h-4 -ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  )
}
