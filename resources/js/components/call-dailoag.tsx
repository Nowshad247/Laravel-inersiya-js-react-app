import { Label } from "recharts"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Textarea } from "./ui/textarea"

export function CallDailoag({ ButtonLabel = "Add Note" }) {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">{ButtonLabel}</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader> 
                        <DialogTitle>Add Note</DialogTitle>
                        <DialogDescription>
                            <form>
                                <div>
                                    <Label to="note">Note</Label>
                                    <Textarea id="note" className="w-full border rounded p-2 mt-1" rows={4} placeholder="Add Note"/>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <Button type="submit">Save</Button>
                                </div>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        )
}