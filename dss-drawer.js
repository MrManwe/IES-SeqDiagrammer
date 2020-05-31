var dss_drawer = {
    
    visualConfig: 
    {
        callSpacing: 55,
        swimlaneSpacing: 250,
        activeLifelineWidth: 10,
        headerHeight: 50,
        headerWidth: 200,
        arrowWidth : 20,
        arrowHeight : 10
    },

    draw : function (dss, _canvas)
    {
        var status =
        {
            canvas : _canvas,
            currentSwimlane: -1,
            currentLine : 0,
            swimlanesIndex : {},
            swimlaneLastActiveRow : [],
            swimlaneCurrentIndent : []
        };

        status.currentSwimlane = this._addSwimlane(":blank", status);
        this._drawActions(dss.actions, status);
       
    },

    _drawActions: function(actions, status)
    {
        var startRow = status.currentLine;
        var currentSwimlane = status.currentSwimlane;
        for (var i = 0; i < actions.length; i++)
        {
            
            var action = actions[i];
            this._drawAction(action, status);
            this._assert(currentSwimlane == status.currentSwimlane, "Swimlane Missmatch");
        }
        var endRow = status.currentLine;
        
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
        var result = call.result;
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
        
        if (targetSwimlaneIndex != sourceSwimlaneIndex)
        {
            this._drawDirectCall(sourceSwimlaneIndex, targetSwimlaneIndex, callName, result, actions, status);
        }
        else if (targetSwimlaneIndex == sourceSwimlaneIndex)
        {
            this._drawSelftCall(sourceSwimlaneIndex, callName, result, actions, status);
        }
        
        
    },

    _drawSelftCall : function(i_swimlane, callName, result, actions, status)
    {
        var indent = status.swimlaneCurrentIndent[i_swimlane];
        var startLine = status.currentLine;
        {
            var startPos = this._swimLanePos(i_swimlane, status.currentLine, indent);
            var endPos = this._swimLanePos(i_swimlane, status.currentLine, indent + 1);
            startPos.y -= this.visualConfig.callSpacing / 3;
            endPos.y += this.visualConfig.callSpacing / 3;
            
            var callArrow = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');

            var points =    (startPos.x) + " " + (startPos.y) 
            + ", " + (endPos.x + this.visualConfig.activeLifelineWidth + this.visualConfig.arrowWidth) + " " + (startPos.y) 
            + ", " + (endPos.x + this.visualConfig.activeLifelineWidth + this.visualConfig.arrowWidth) + " " + (endPos.y) 
            + ", " + (endPos.x) + " " + (endPos.y) 
            callArrow.setAttribute("points",points); 
            callArrow.setAttribute("class","dss-call");
            status.canvas.appendChild(callArrow);
        
            var arrowHead = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
            var points =    (endPos.x + this.visualConfig.arrowWidth) + " " + (endPos.y - this.visualConfig.arrowHeight/2) 
                            + ", " + (endPos.x) + " " + (endPos.y) 
                            + ", " + (endPos.x + this.visualConfig.arrowWidth) + " " + (endPos.y + this.visualConfig.arrowHeight/2) 
            arrowHead.setAttribute("points",points); 
            arrowHead.setAttribute("class","dss-call");
            status.canvas.appendChild(arrowHead);

            var text = document.createElementNS("http://www.w3.org/2000/svg", 'text'); //Create a path in SVG's namespace
            text.setAttribute("class","dss-call");
            text.setAttribute("x",endPos.x + 6 + this.visualConfig.activeLifelineWidth + this.visualConfig.arrowWidth); 
            text.setAttribute("y",startPos.y + 1); 
            text.setAttribute("dominant-baseline", "hanging");
            text.setAttribute("text-anchor", "start");
            text.innerHTML = callName;
            status.canvas.appendChild(text);
        }

        

        var actionsLength = 0;
        if (actions != null)
        {
            //Todo, actions
            status.currentLine += 1;
            status.swimlaneCurrentIndent[i_swimlane]++;
            this._drawActions(actions.actions, status);
            status.swimlaneCurrentIndent[i_swimlane]--;
        }
        else
        {
            status.currentLine += 1;
        }

        
        {
            var startPos = this._swimLanePos(i_swimlane, status.currentLine + actionsLength, indent + 1);
            var endPos = this._swimLanePos(i_swimlane, status.currentLine + actionsLength , indent);
            startPos.y -= this.visualConfig.callSpacing / 3;
            endPos.y += this.visualConfig.callSpacing / 3;
            
            var callArrow = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
            
            var points =    (startPos.x) + " " + (startPos.y) 
            + ", " + (startPos.x + this.visualConfig.activeLifelineWidth + this.visualConfig.arrowWidth) + " " + (startPos.y) 
            + ", " + (startPos.x + this.visualConfig.activeLifelineWidth + this.visualConfig.arrowWidth) + " " + (endPos.y) 
            + ", " + (endPos.x) + " " + (endPos.y) 
            callArrow.setAttribute("points",points); 
            callArrow.setAttribute("class","dss-call");
            callArrow.setAttribute("stroke-dasharray","4");
            status.canvas.appendChild(callArrow);
            
            
            var arrowHead = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
            var points =    (endPos.x + this.visualConfig.arrowWidth) + " " + (endPos.y - this.visualConfig.arrowHeight/2) 
            + ", " + (endPos.x) + " " + (endPos.y) 
            + ", " + (endPos.x + this.visualConfig.arrowWidth) + " " + (endPos.y + this.visualConfig.arrowHeight/2) 
            arrowHead.setAttribute("points",points); 
            arrowHead.setAttribute("class","dss-call");
            status.canvas.appendChild(arrowHead);

            if (result)
            {
                var text = document.createElementNS("http://www.w3.org/2000/svg", 'text'); //Create a path in SVG's namespace
                text.setAttribute("class","dss-call");
                text.setAttribute("x",startPos.x + 6 + this.visualConfig.activeLifelineWidth + this.visualConfig.arrowWidth); 
                text.setAttribute("y",endPos.y + 1); 
                text.setAttribute("dominant-baseline", "baselile");
                text.setAttribute("text-anchor", "start");
                text.innerHTML = result;
                status.canvas.appendChild(text);
            }
        }
        
        this._drawActiveSwimlane(i_swimlane, startLine, status.currentLine, status, indent + 1);
        status.currentLine += 1;
        
        /*
       
        */
        
    },
    
    _drawDirectCall : function(sourceSwimlaneIndex, targetSwimlaneIndex, callName, result, actions, status)
    {
        var startLine = status.currentLine;
        var source = this._swimLanePos(sourceSwimlaneIndex, status.currentLine, status.swimlaneCurrentIndent[sourceSwimlaneIndex]);
        var destination = this._swimLanePos(targetSwimlaneIndex, status.currentLine, status.swimlaneCurrentIndent[targetSwimlaneIndex]);

        var direction = 1;
        if (source.x > destination.x)
        {
            direction = -1;
        }
        source.x += this.visualConfig.activeLifelineWidth/2 * direction;
        destination.x -= this.visualConfig.activeLifelineWidth/2 * direction;

        var line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        line.setAttribute("x1",source.x); 
        line.setAttribute("y1",source.y); 
        line.setAttribute("x2",destination.x - this.visualConfig.activeLifelineWidth/2); 
        line.setAttribute("y2",destination.y); 
        line.setAttribute("class","dss-call");
        status.canvas.appendChild(line);

       
        
        {
        var arrowHead = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
        var points =    (destination.x - this.visualConfig.arrowWidth * direction) + " " + (destination.y - this.visualConfig.arrowHeight/2 * direction) 
                        + ", " + (destination.x) + " " + (destination.y) 
                        + ", " + (destination.x - this.visualConfig.arrowWidth * direction) + " " + (destination.y + this.visualConfig.arrowHeight/2 * direction) 
        arrowHead.setAttribute("points",points); 
        arrowHead.setAttribute("class","dss-call");
        status.canvas.appendChild(arrowHead);
        }
        
        var text = document.createElementNS("http://www.w3.org/2000/svg", 'text'); //Create a path in SVG's namespace
        text.setAttribute("class","dss-call");
        text.setAttribute("x",source.x + 22 * direction); 
        text.setAttribute("y",source.y - 6); 
        text.setAttribute("dominant-baseline", "baseline");
        if (direction > 0)
        {
            text.setAttribute("text-anchor", "start");
        }
        else
        {
            text.setAttribute("text-anchor", "end");
        }
        text.innerHTML = callName;
        status.canvas.appendChild(text);

        var endLine = status.currentLine;
        if (actions == null)
        {
            var arrowHead2 = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
            var points =    (source.x + this.visualConfig.arrowWidth * direction) + " " + (source.y - this.visualConfig.arrowHeight/2 * direction) 
            + ", " + (source.x) + " " + (source.y) 
            + ", " + (source.x + this.visualConfig.arrowWidth * direction) + " " + (source.y + this.visualConfig.arrowHeight/2 * direction) 
            arrowHead2.setAttribute("points",points); 
            arrowHead2.setAttribute("class","dss-call");
            status.canvas.appendChild(arrowHead2);
            
            if (result != null)
            {
                var resultPosition = source;
                var resultText = document.createElementNS("http://www.w3.org/2000/svg", 'text'); //Create a path in SVG's namespace
                resultText.setAttribute("class","dss-call");
                resultText.setAttribute("x",resultPosition.x + 22 * direction); 
                resultText.setAttribute("y",resultPosition.y + 6); 
                resultText.setAttribute("dominant-baseline", "hanging");
                if (direction > 0)
                {
                    resultText.setAttribute("text-anchor", "start");
                }
                else
                {
                    resultText.setAttribute("text-anchor", "end");
                }
                resultText.innerHTML = result;
                status.canvas.appendChild(resultText);
            }
            status.currentLine++;
        }
        else
        {
            status.currentSwimlane = targetSwimlaneIndex;
            status.currentLine++;
            this._drawActions(actions.actions, status);

            if (result != null)
            {
                var resultTarget = this._swimLanePos(sourceSwimlaneIndex, status.currentLine, status.swimlaneCurrentIndent[sourceSwimlaneIndex]);
                var resultSource = this._swimLanePos(targetSwimlaneIndex, status.currentLine, status.swimlaneCurrentIndent[targetSwimlaneIndex]);

                resultSource.x -= this.visualConfig.activeLifelineWidth/2 * direction;
                resultTarget.x += this.visualConfig.activeLifelineWidth/2 * direction;

                var resultText = document.createElementNS("http://www.w3.org/2000/svg", 'text'); //Create a path in SVG's namespace
                resultText.setAttribute("class","dss-call");
                resultText.setAttribute("x",resultTarget.x + 22 * direction); 
                resultText.setAttribute("y",resultTarget.y + 6); 
                resultText.setAttribute("dominant-baseline", "hanging");
                if (direction > 0)
                {
                    resultText.setAttribute("text-anchor", "start");
                }
                else
                {
                    resultText.setAttribute("text-anchor", "end");
                }
                resultText.innerHTML = result;
                status.canvas.appendChild(resultText);

                var arrowHead2 = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
                var points =    (resultTarget.x + this.visualConfig.arrowWidth * direction) + " " + (resultTarget.y - this.visualConfig.arrowHeight/2 * direction) 
                + ", " + (resultTarget.x) + " " + (resultTarget.y) 
                + ", " + (resultTarget.x + this.visualConfig.arrowWidth * direction) + " " + (resultTarget.y + this.visualConfig.arrowHeight/2 * direction) 
                arrowHead2.setAttribute("points",points); 
                arrowHead2.setAttribute("class","dss-call");
                status.canvas.appendChild(arrowHead2);

                var resultLine = document.createElementNS("http://www.w3.org/2000/svg", 'line');
                resultLine.setAttribute("x1",resultSource.x - this.visualConfig.activeLifelineWidth/2 * direction); 
                resultLine.setAttribute("y1",resultSource.y); 
                resultLine.setAttribute("x2",resultTarget.x + this.visualConfig.activeLifelineWidth/2 * direction); 
                resultLine.setAttribute("y2",resultTarget.y); 
                resultLine.setAttribute("class","dss-call");
                resultLine.setAttribute("stroke-dasharray","4");
                status.canvas.appendChild(resultLine);

                status.currentLine++;
            }


            status.currentSwimlane = sourceSwimlaneIndex;
        }
        this._drawActiveSwimlane(targetSwimlaneIndex, startLine, status.currentLine - 1, status, status.swimlaneCurrentIndent[targetSwimlaneIndex]);
    },

    _drawActiveSwimlane: function(i_siwmlane, i_startLine, i_endLine, io_status, indent)
    {
        var lastActive = io_status.swimlaneLastActiveRow[i_siwmlane];
        var startInactivePos = this._swimLanePos(i_siwmlane, lastActive, 0);
        if (lastActive == -1) //Header
        {
            startInactivePos.y += this.visualConfig.headerHeight;
        }
        var startPos = this._swimLanePos(i_siwmlane, i_startLine, indent);
        var endPos = this._swimLanePos(i_siwmlane, i_endLine, indent);
        var delta = this.visualConfig.callSpacing / 6;
        
        if (indent == 0)
        {
            var lifeline = document.createElementNS("http://www.w3.org/2000/svg", 'line'); //Create a path in SVG's namespace
            lifeline.setAttribute("x1", startInactivePos.x);
            lifeline.setAttribute("y1", startInactivePos.y + delta);
            lifeline.setAttribute("x2", startPos.x);
            lifeline.setAttribute("y2", startPos.y );
            lifeline.setAttribute("class","dss-swimlane");
            lifeline.setAttribute("stroke-dasharray","4");
            canvas.appendChild(lifeline);
        }

        var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect'); //Create a path in SVG's namespace
        rect.setAttribute("width",this.visualConfig.activeLifelineWidth); 
        rect.setAttribute("height",delta * 2 + endPos.y - startPos.y );
        rect.setAttribute("class","dss-activeswimlane");
        rect.setAttribute("x",startPos.x - this.visualConfig.activeLifelineWidth / 2); 
        rect.setAttribute("y",startPos.y - delta); 
        io_status.canvas.appendChild(rect);

        if (indent == 0)
        {
            io_status.swimlaneLastActiveRow[i_siwmlane] = i_endLine;
        }

    },


    _addSwimlane(swimlaneTitle, status)
    {
        var c = 0;
        for (p in status.swimlanesIndex) {
            if (status.swimlanesIndex.hasOwnProperty(p)) {
                c += 1;
            }
        }
        
        var newIndex = c + 1;
        this._drawSwimLane(swimlaneTitle, status.canvas, newIndex);
        status.swimlanesIndex[swimlaneTitle] = newIndex;
        status.swimlaneLastActiveRow[newIndex] = -1;
        status.swimlaneCurrentIndent[newIndex] = 0;
        return newIndex;
    },

    _drawSwimLane : function(swimlaneTitle, canvas, swimplaneIdx)
    {
        var pos = this._swimLanePos(swimplaneIdx , -1, 0);
        var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect'); //Create a path in SVG's namespace
        rect.setAttribute("width",this.visualConfig.headerWidth); 
        rect.setAttribute("height",this.visualConfig.headerHeight);
        rect.setAttribute("class","dss-swimlane");
        rect.setAttribute("x",pos.x - this.visualConfig.headerWidth/2); 
        rect.setAttribute("y",pos.y); 
        canvas.appendChild(rect);

        var text = document.createElementNS("http://www.w3.org/2000/svg", 'text'); //Create a path in SVG's namespace
        text.setAttribute("class","dss-swimlane");
        text.setAttribute("x",pos.x); 
        text.setAttribute("y",pos.y + this.visualConfig.headerHeight/2); 
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("text-decoration", "underline");
        rect.setAttribute("class","dss-swimlane");
        text.innerHTML = swimlaneTitle;
        canvas.appendChild(text);
    },

    _swimLanePos: function(swimplaneIdx, row, indent) //row = -1 equals header
    {
        if (row == -1)
        {
            return  {    
                        "x": 50 + swimplaneIdx * this.visualConfig.swimlaneSpacing,
                        "y" : 50
                    };
        }
        else
        {
            return  {    
                "x": 50 + swimplaneIdx * this.visualConfig.swimlaneSpacing + indent * this.visualConfig.activeLifelineWidth,
                "y" : 50 + 100 + row * this.visualConfig.callSpacing
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