var dss_drawer = {
    
    draw : function (dss, _canvas)
    {
        var status =
        {
            canvas : _canvas,
            currentSwimlane: -1,
            currentLine : 0,
            swimlanesIndex : {}
        };

        status.currentSwimlane = this._addSwimlane(":blank", status);
        this._drawActions(dss.actions, status);
       
    },

    _drawActions: function(actions, status)
    {
        for (var i = 0; i < actions.length; i++)
        {
            var currentSwimlane = status.currentSwimlane;
            var action = actions[i];
            this._drawAction(action, status);
            this._assert(currentSwimlane == status.currentSwimlane, "Swimlane Missmatch");
        }
    },

    _drawAction: function(action, status)
    {
        if (action.action == "call")
        {
            this._drawCall(action, status);
        }
    },

    _drawCall: function(call, status)
    {
        var targetSwimlane = call.targetSwimlane;
        var callName = call.call;
        var actions = call.actions;
        var targetSwimlaneIndex = 0;
        if (status.swimlanesIndex[targetSwimlane] == undefined)
        {
            targetSwimlaneIndex = this._addSwimlane(targetSwimlane, status);
        }
        else
        {
            targetSwimlaneIndex = status.swimlanesIndex[targetSwimlane];
        }
        var sourceSwimlaneIndex = status.currentSwimlane;

        var source = this._swimLanePos(sourceSwimlaneIndex, status.currentLine);
        var destination = this._swimLanePos(targetSwimlaneIndex, status.currentLine);

        var line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        line.setAttribute("x1",source.x); 
        line.setAttribute("y1",source.y); 
        line.setAttribute("x2",destination.x); 
        line.setAttribute("y2",destination.y); 
        line.setAttribute("class","dss-call");
        status.canvas.appendChild(line);

        var arrowWidth = 20;
        var arrowHeight = 10;
        
        {
        var arrowHead = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
        var points =    (destination.x - arrowWidth) + " " + (destination.y - arrowHeight/2) 
                        + ", " + (destination.x) + " " + (destination.y) 
                        + ", " + (destination.x - arrowWidth) + " " + (destination.y + arrowHeight/2) 
        arrowHead.setAttribute("points",points); 
        arrowHead.setAttribute("class","dss-call");
        status.canvas.appendChild(arrowHead);
        }
        
        var text = document.createElementNS("http://www.w3.org/2000/svg", 'text'); //Create a path in SVG's namespace
        text.setAttribute("class","dss-call");
        text.setAttribute("x",source.x + 22); 
        text.setAttribute("y",source.y - 6); 
        text.setAttribute("dominant-baseline", "baseline");
        text.setAttribute("text-anchor", "left");
        text.innerHTML = callName;
        status.canvas.appendChild(text);


        if (actions == null)
        {
            var arrowHead2 = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
            var points =    (source.x + arrowWidth) + " " + (source.y - arrowHeight/2) 
                            + ", " + (source.x) + " " + (source.y) 
                            + ", " + (source.x + arrowWidth) + " " + (source.y + arrowHeight/2) 
            arrowHead2.setAttribute("points",points); 
            arrowHead2.setAttribute("class","dss-call");
            status.canvas.appendChild(arrowHead2);
        }
        else
        {

        }
    },



    _addSwimlane(swimlaneTitle, status)
    {
        var newIndex = status.currentSwimlane + 1;
        this._drawSwimLane(swimlaneTitle, status.canvas, newIndex);
        status.swimlanesIndex[swimlaneTitle] = newIndex;
        return newIndex;
    },

    _drawSwimLane : function(swimlaneTitle, canvas, swimplaneIdx)
    {
        var pos = this._swimLanePos(swimplaneIdx , -1);
        pos.x -= 50;
        var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect'); //Create a path in SVG's namespace
        rect.setAttribute("width","100"); 
        rect.setAttribute("height","50");
        rect.setAttribute("class","dss-swimlane");
        rect.setAttribute("x",pos.x); 
        rect.setAttribute("y",pos.y); 
        canvas.appendChild(rect);

        var text = document.createElementNS("http://www.w3.org/2000/svg", 'text'); //Create a path in SVG's namespace
        text.setAttribute("width","100"); 
        text.setAttribute("height","50");
        text.setAttribute("class","dss-swimlane");
        text.setAttribute("x",pos.x + 50); 
        text.setAttribute("y",pos.y + 25); 
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("text-anchor", "middle");
        text.innerHTML = swimlaneTitle;
        canvas.appendChild(text);
    },

    _swimLanePos: function(swimplaneIdx, row) //row = -1 equals header
    {
        if (row == -1)
        {
            return  {    
                        "x": 50 + swimplaneIdx * 250,
                        "y" : 50
                    };
        }
        else
        {
            return  {    
                "x": 50 + swimplaneIdx * 250,
                "y" : 50 + 100 + row * 30
            };
        }
    },

    _assert: function(cond, text)
    {
        if (!cond)
        {
            alert(text);
        }
    }
}