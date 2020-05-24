var dss =
{
    inici : function()
    {
        return {
            actions: [],
            call : function(swimlane, callName, subdss)
            {
                this.actions.push
                (
                    {
                        action: "call",
                        targetSwimlane: swimlane,
                        call: callName,
                        actions: subdss
                    }
                );
                return this;
            }
        }
    }

}
