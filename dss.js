var dss =
{
    inici : function()
    {
        return {
            actions: [],
            call : function(i_swimlane, i_callName, i_result = null, i_subdss = null)
            {
                this.actions.push
                (
                    {
                        action: "call",
                        targetSwimlane: i_swimlane,
                        call: i_callName,
                        result: i_result,
                        actions: i_subdss
                    }
                );
                return this;
            },
            
            comment : function (i_text)
            {
                this.actions.push
                (
                    {
                        action: "comment",
                        comment: i_text
                    }
                );
                return this;
            },

            frame : function (i_frameName, i_frameCondition, i_subdss = null)
            {
                this.actions.push
                (
                    {
                        action: "frame",
                        frameName: i_frameName,
                        condition: i_frameCondition,
                        actions: i_subdss
                    }
                );
                return this;
            },

            create(i_swimlane, i_callName)
            {
                this.actions.push
                (
                    {
                        action: "creator",
                        swimlane: i_swimlane,
                        call: i_callName
                    }
                );
                return this;
            }
        }
    }

}
