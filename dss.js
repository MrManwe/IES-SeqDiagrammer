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
            }
        }
    }

}
