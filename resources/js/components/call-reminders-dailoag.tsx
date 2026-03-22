import { Label } from "recharts"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Textarea } from "./ui/textarea"
import { toDate } from "date-fns"

export function CallRemindersDialog({ ButtonLabel = "Add Reminder" }) {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">{ButtonLabel}</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader> 
                        <DialogTitle>Add Reminder</DialogTitle>
                        <DialogDescription>
                            <form>
                                <div>
                                    <Label to="reminder">Next Remind Time</Label>
                                    <input required type="datetime-local" id="reminder" className="w-full border rounded p-2 mt-1" />
                                </div>
                                <div className="mt-4">
                                    <Label> lead Remind Staus</Label>
                                    <select required className="w-full border rounded p-2 mt-1">
                                        <option value="0">Pending</option>
                                        <option value="1">Completed</option>
                                    </select>
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